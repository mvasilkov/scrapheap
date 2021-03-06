import math

from django.db import models

from auto_integ.pre_auto import pre_auto, PAError, ACCEPT, SKIP

from ..utils import repr_attributes, run_if_active, abstract_run

from .queue import Queue
from .buffer import Buffer
from .issue import Issue


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


class AutoFilter(Filter):
    issues_per_cycle = models.PositiveSmallIntegerField(default=4)

    @run_if_active
    def run(self):
        issues = [
            issue for issue in self.from_buffer.get_ordered(count=math.inf)
            if not issue.pending_blocking
        ]
        if not issues:
            return

        issues = issues[:self.issues_per_cycle]
        moved_issues = []

        for issue in issues:
            if issue.has_3_digit_versions:
                print(f'Updating fix versions for {issue.key}')
                issue.expand_3_digit_versions()  # This also updates the Jira issue
                issue.save()

            print(f'Running pre_auto({issue.key})')
            print('-' * 40)
            issue.is_running = True
            issue.save()

            try:
                result = pre_auto(issue.key)
            except PAError as err:
                issue.buffer = None
                issue.verdict = Issue.VERDICT_FAILED
                issue.props.pop(Issue.ATTEMPTED_MULTIPLE, None)
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
