from datetime import timedelta

from django.db import models
from django.utils import timezone

from integlib.runtime import runtime

from ..utils import repr_attributes, run_if_active, abstract_run

from .queue import Queue
from .buffer import Buffer
from .issue import Issue


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
