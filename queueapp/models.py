from datetime import timedelta
from functools import cmp_to_key

from django.db import models
from django.utils import timezone

from annoying.fields import JSONField

from .utils import compile_cmp, issue_cmp, new_dict


class Queue(models.Model):
    name = models.CharField(max_length=60)
    is_active = models.BooleanField(default=False)


class Buffer(models.Model):
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    cmp_function = models.TextField()

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
        return buf[:count]

    def count(self, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        return qs.count()


class Issue(models.Model):
    buffer = models.ForeignKey(Buffer, on_delete=models.CASCADE, related_name='issues', null=True)
    key = models.CharField(max_length=30, unique=True, editable=False)
    props = JSONField(default=new_dict, editable=False)
    is_running = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Poller(models.Model):
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    to_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)
    interval = models.DurationField(default=timedelta(minutes=1))
    updated = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        abstract = True


class Filter(models.Model):
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT, related_name='to_filter')
    to_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT, related_name='from_filter')

    class Meta:
        abstract = True


class Actuator(models.Model):
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)

    class Meta:
        abstract = True


class JiraPoller(Poller):
    query = models.CharField(max_length=1000)


class AutoFilter(Filter):
    pass


class JenkinsActuator(Actuator):
    project_name = models.CharField(max_length=60)
