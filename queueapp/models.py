from datetime import timedelta
from functools import cmp_to_key
import math

from django.db import models
from django.utils import timezone

from annoying.fields import JSONField
from annoying.functions import get_object_or_None

from auto_integ.pre_auto import pre_auto, PAError, ACCEPT, SKIP
from integlib.jenkins import JenkinsException
from integlib.runtime import runtime

from .utils import compile_cmp, issue_cmp, new_dict, repr_attributes, run_if_active
from .integ_utils import IGNORED_ISSUES, issue_running_or_pending


@repr_attributes('name')
class Queue(models.Model):
    name = models.CharField(max_length=60)
    is_active = models.BooleanField(default=False)

    def get_filters(self):
        filters = {}

        for filter_class in [AutoFilter, NopFilter]:
            filters.update({
                a.from_buffer.pk: a
                for a in filter_class.objects.filter(
                    queue=self, from_buffer__isnull=False, to_buffer__isnull=False)
            })

        return filters

    def get_components(self):
        'This function assumes a well-formed queue'

        poller = get_object_or_None(JiraPoller, queue=self)
        actuator = get_object_or_None(JenkinsActuator, queue=self)
        bad_queue = (poller is None or
                     actuator is None or
                     poller.to_buffer is None or
                     actuator.from_buffer is None)
        if bad_queue:
            return ()

        filters = self.get_filters()

        components = [poller, poller.to_buffer]
        while filters:
            a = filters[components[-1].pk]
            del filters[components[-1].pk]
            components.extend([a, a.to_buffer])

        components.append(actuator)
        return components

    def log(self, message: str):
        last_log = self.logs.order_by('-pk').first()
        if last_log is not None and last_log.message == message:
            last_log.count += 1
            last_log.save()
            return
        log = Log.objects.create(queue=self, message=message)
        log.save()

    def get_logs(self):
        return list(self.logs.order_by('-pk')[:10])[::-1]

    class Meta:
        ordering = ('name', )


@repr_attributes('name', 'queue.name')
class Buffer(models.Model):
    name = models.CharField(max_length=60)
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    cmp_function = models.TextField(blank=True)
    cmp_rules = models.CharField(max_length=1000, blank=True)

    def key_function(self):
        cmp = compile_cmp(self.cmp_function) if self.cmp_function else None
        if cmp is None:
            cmp = issue_cmp
        return cmp_to_key(cmp)

    def get_ordered(self, *, count=None, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        buf = list(qs)
        if not buf:
            return None if count is None else []
        buf.sort(key=self.key_function())
        if count is None:
            return buf[0]
        if count is math.inf:
            return buf
        return buf[:count]

    @property
    def ordered_issues(self):
        return self.get_ordered(count=math.inf, with_running=True)

    def get_ordered_without_versions(self, *, count=None, with_running=False, without_versions=None):
        if not without_versions:
            return self.get_ordered(count=count, with_running=with_running)
        buf1 = self.get_ordered(count=math.inf, with_running=with_running)
        buf = [a for a in buf1 if not set(a.fix_versions) & without_versions]
        if not buf:
            return None if count is None else []
        if count is None:
            return buf[0]
        if count is math.inf:
            return buf
        return buf[:count]

    def get_issues(self, *, count=None, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        return list(qs if count is None else qs[:count])

    def count(self, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        return qs.count()


@repr_attributes('key')
class Issue(models.Model):
    VERDICT_NONE = 'pending'
    VERDICT_SUCCEEDED = 'succeeded'
    VERDICT_FAILED = 'failed'
    VERDICT = ((VERDICT_NONE, VERDICT_NONE), (VERDICT_SUCCEEDED, VERDICT_SUCCEEDED),
               (VERDICT_FAILED, VERDICT_FAILED))

    ATTEMPTED_MULTIPLE = '<ATTEMPTED_MULTIPLE>'

    buffer = models.ForeignKey(Buffer, on_delete=models.CASCADE, related_name='issues', null=True)
    key = models.CharField(max_length=30, unique=True, editable=False)
    props = JSONField(default=new_dict)
    is_running = models.BooleanField(default=False)
    verdict = models.CharField(max_length=10, choices=VERDICT, default=VERDICT_NONE)
    number_tries = models.PositiveIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    @staticmethod
    def is_usable(issue_key: str):
        'Whether the issue can be put into queue.'

        if not isinstance(issue_key, str):
            issue_key = issue_key.key

        if issue_key in IGNORED_ISSUES:
            return False

        try:
            issue = Issue.objects.get(key=issue_key)
        except Issue.DoesNotExist:
            return True

        return issue.buffer is None  # and issue.verdict == Issue.VERDICT_FAILED

    @staticmethod
    def create_or_update_props(integ_issue):
        try:
            issue = Issue.objects.get(key=integ_issue.key)
        except Issue.DoesNotExist:
            issue = Issue(key=integ_issue.key)

        issue.update_props(integ_issue)
        issue.save()
        return issue

    def update_props(self, integ_issue):
        preserve_fields = {
            k: v
            for k, v in self.props.items() if k.startswith('<') and k.endswith('>')
        }
        self.props = {
            'fix_versions': integ_issue.fix_versions,
            'priority': integ_issue.priority,
            'assignee_name': integ_issue.assignee.displayName,
            'summary': integ_issue.summary,
        }
        self.props.update(preserve_fields)

    @property
    def fix_versions(self):
        return self.props.get('fix_versions', [])

    @property
    def priority(self):
        return self.props.get('priority', None)


def abstract_run(self):
    raise NotImplementedError(f'Class {self.__class__.__name__} does not implement run()')


@repr_attributes('name', 'queue.name')
class Poller(models.Model):
    name = models.CharField(max_length=60)
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    to_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)
    interval = models.DurationField(default=timedelta(minutes=1))
    updated = models.DateTimeField(default=timezone.now, blank=True)

    run = abstract_run

    class Meta:
        abstract = True


@repr_attributes('name', 'queue.name')
class Filter(models.Model):
    name = models.CharField(max_length=60)
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT, related_name='to_%(class)s')
    to_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT, related_name='from_%(class)s')
    is_active = models.BooleanField(default=False)

    run = abstract_run

    class Meta:
        abstract = True


@repr_attributes('name', 'queue.name')
class Actuator(models.Model):
    name = models.CharField(max_length=60)
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)

    run = abstract_run

    class Meta:
        abstract = True


@repr_attributes('message')
class Log(models.Model):
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT, related_name='logs')
    updated = models.DateTimeField(auto_now=True)
    message = models.TextField()
    count = models.PositiveIntegerField(default=1)

    @staticmethod
    def truncate_logs(queue: Queue):
        to_remove = queue.logs.order_by('-pk')[999:].values_list('pk', flat=True)
        Log.objects.filter(pk__in=to_remove).delete()

    class Meta:
        ordering = ('-pk', )


class JiraPoller(Poller):
    query = models.CharField(max_length=1000)

    @run_if_active
    def run(self):
        integ_issues = runtime.jira.search_issues(self.query)
        issues = [
            Issue.create_or_update_props(integ_issue) for integ_issue in integ_issues
            if Issue.is_usable(integ_issue)
        ]
        if not issues:
            return

        for issue in issues:
            issue.buffer = self.to_buffer
            issue.is_running = False  # should not be needed
            issue.verdict = Issue.VERDICT_NONE
            issue.save()

        issues = ', '.join([f'<a class=issue>{issue.key}</a>' for issue in issues])
        self.queue.log(f'Inserted issue(s): {issues} to buffer <b>{self.to_buffer.name}</b>')


class AutoFilter(Filter):
    ISSUES_PER_CYCLE = 4

    @run_if_active
    def run(self):
        issues = self.from_buffer.get_ordered(count=AutoFilter.ISSUES_PER_CYCLE)
        if not issues:
            return

        moved_issues = []

        for issue in issues:
            print(f'Running pre_auto({issue.key})')
            print('-' * 40)
            issue.is_running = True
            issue.save()

            try:
                result = pre_auto(issue.key)
            except PAError as err:
                issue.buffer = None
                issue.verdict = Issue.VERDICT_FAILED
                del issue.props[Issue.ATTEMPTED_MULTIPLE]
                issue.save()
                self.queue.log(f'The issue <a class=issue>{issue.key}</a> failed {str(err)}')
                continue
            finally:
                print('-' * 40)
                issue.is_running = False
                issue.save()

            if result is SKIP:
                issue.buffer = None
                issue.verdict = Issue.VERDICT_SUCCEEDED
                issue.save()
                self.queue.log(f'Dropping the issue <a class=issue>{issue.key}</a> from the queue because pre_auto')
                continue

            assert result is ACCEPT
            issue.buffer = self.to_buffer
            issue.save()
            moved_issues.append(issue)

        moved_issues = ', '.join([f'<a class=issue>{issue.key}</a>' for issue in moved_issues])
        self.queue.log(f'Moved issue(s): {moved_issues} to buffer <b>{self.to_buffer.name}</b>')


class NopFilter(Filter):
    @run_if_active
    def run(self):
        issues = self.from_buffer.get_issues()
        if not issues:
            return

        for issue in issues:
            issue.buffer = self.to_buffer
            issue.save()

        issues = ', '.join([f'<a class=issue>{issue.key}</a>' for issue in issues])
        self.queue.log(f'Moved issue(s): {issues} to buffer <b>{self.to_buffer.name}</b>')


class JenkinsActuator(Actuator):
    MULTIPLE_COUNT_LOWER = 2  # Inclusive
    MULTIPLE_COUNT_UPPER = 4  # Inclusive

    project_name = models.CharField(max_length=60)
    issue_param = models.CharField(max_length=30, default='ISSUE')
    project_name2 = models.CharField(max_length=60, blank=True, help_text='Many issues at once (optional)')
    issue_param2 = models.CharField(max_length=30, default='ISSUES')  # TODO Move these to a new model: JenkinsProject

    def get_jenkins_job(self, project_name: str):
        try:
            jenkins_job = runtime.jenkins.get_job(project_name)
            if not jenkins_job.is_enabled():
                print(f'The Jenkins job `{project_name}` is disabled. It will not be used')
                jenkins_job = None
            return jenkins_job
        except JenkinsException:
            print(f'The Jenkins job `{project_name}` is inaccessible. It will not be used')
            jenkins_job = None

    @run_if_active
    def run(self):
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
            count=JenkinsActuator.MULTIPLE_COUNT_UPPER, without_versions=taken_versions)
        ready_issues2 = [issue for issue in ready_issues if Issue.ATTEMPTED_MULTIPLE not in issue.props]

        if len(ready_issues2) >= JenkinsActuator.MULTIPLE_COUNT_LOWER and jenkins_job2:
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
