from django.core.cache import cache
from django.db import models

from integlib.jenkins import JenkinsException
from integlib.runtime import runtime

from ..utils import repr_attributes, run_if_active, abstract_run
from ..integ_utils import issue_running_or_pending

from .queue import Queue
from .buffer import Buffer
from .issue import Issue


@repr_attributes('name', 'queue.name')
class Actuator(models.Model):
    name = models.CharField(max_length=60)
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)

    run = abstract_run

    class Meta:
        abstract = True


class JenkinsActuator(Actuator):
    project_name = models.CharField(max_length=60)
    issue_param = models.CharField(max_length=30, default='ISSUE')
    project_name2 = models.CharField(max_length=60, blank=True, help_text='Many issues at once (optional)')
    issue_param2 = models.CharField(max_length=30, default='ISSUES')
    multiple_count_lower = models.PositiveSmallIntegerField(default=3, help_text='Inclusive')
    multiple_count_upper = models.PositiveSmallIntegerField(default=5, help_text='Inclusive')

    def get_jenkins_job(self, project_name: str):
        key = f'jenkins_{project_name}'
        result = cache.get(key)
        if result is not None:
            return result

        try:
            jenkins_job = runtime.jenkins.get_job(project_name)
            if jenkins_job.is_enabled():
                cache.set(key, jenkins_job, 60)
            else:
                print(f'The Jenkins job `{project_name}` is disabled. It will not be used')
                jenkins_job = None
            return jenkins_job
        except JenkinsException:
            print(f'The Jenkins job `{project_name}` is inaccessible. It will not be used')
            jenkins_job = None

    @staticmethod
    def exclude_disconnected_issues(issues):  # Issue[] -> Issue[]
        if not issues:
            return []
        visited_issues = set(issues[:1])
        versions = set(issues[0].fix_versions)
        repeat = True
        while repeat:  # while versions is getting updated
            repeat = False
            for a in issues[1:]:
                if a not in visited_issues and set(a.fix_versions) & versions:
                    visited_issues.add(a)
                    versions.update(a.fix_versions)
                    repeat = True
        return [a for a in issues if set(a.fix_versions) & versions]

    @run_if_active
    def check_running_issues(self):
        jenkins_job = self.get_jenkins_job(self.project_name)
        jenkins_job2 = self.get_jenkins_job(self.project_name2) if self.project_name2 else None

        running_issues = {
            self.project_name: [],
            self.project_name2: [],
        }

        for running_issue in self.from_buffer.issues.filter(is_running=True):
            if issue_running_or_pending(running_issue, jenkins_job, self.issue_param):
                running_issues[self.project_name].append(running_issue)
            elif issue_running_or_pending(running_issue, jenkins_job2, self.issue_param2):
                running_issues[self.project_name2].append(running_issue)
            else:
                integ_issue = runtime.jira.get_issue(running_issue.key)
                running_issue.buffer = None
                running_issue.is_running = False
                running_issue.verdict = (Issue.VERDICT_SUCCEEDED
                                         if integ_issue.status_category == 'Done' else
                                         Issue.VERDICT_FAILED)
                running_issue.number_tries += 1
                running_issue.update_props(integ_issue)
                running_issue.save()
                self.queue.log(f'The issue <a class=issue>{running_issue.key}</a> '
                               f'<b>{running_issue.verdict}</b> integration')

        return jenkins_job, jenkins_job2, running_issues

    @run_if_active
    def run(self):
        jenkins_job, jenkins_job2, running_issues = self.check_running_issues()

        taken_versions = set()
        if running_issues[self.project_name] or running_issues[self.project_name2]:
            for project_name, project_issues in running_issues.items():
                if not project_issues:
                    continue
                for issue in project_issues:
                    taken_versions.update(issue.fix_versions)
                issue_keys = ' '.join(issue.key for issue in project_issues)
                print(f'The Jenkins job `{project_name}` is doing the issue(s) `{issue_keys}`')
            if taken_versions:
                print(f'The following versions are taken: {taken_versions}')

        ready_issues = self.from_buffer.get_ordered_without_versions(
            count=self.multiple_count_upper, without_versions=taken_versions)
        ready_issues = [issue for issue in ready_issues if not issue.pending_blocking]
        ready_issues2 = [issue for issue in ready_issues if not issue.attempted_multiple]
        ready_issues2 = self.exclude_disconnected_issues(ready_issues2)

        if len(ready_issues2) >= self.multiple_count_lower and jenkins_job2:
            issue_keys = ' '.join(issue.key for issue in ready_issues2)
            jenkins_job2.submit_build(**{self.issue_param2: issue_keys})
            for issue in ready_issues2:
                issue.is_running = True
                issue.props[Issue.ATTEMPTED_MULTIPLE] = 1  # Any value. We're only checking that the key is present
                issue.save()
            issue_links = ' '.join(f'<a class=issue>{issue.key}</a>' for issue in ready_issues2)
            self.queue.log(f'Sending the following issues to integration: {issue_links}')
            return

        if ready_issues and jenkins_job:
            issue = ready_issues[0]
            jenkins_job.submit_build(**{self.issue_param: issue.key})
            issue.is_running = True
            issue.save()
            self.queue.log(f'Sending the issue <a class=issue>{issue.key}</a> to integration')
