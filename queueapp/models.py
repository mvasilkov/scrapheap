from datetime import timedelta
from functools import cmp_to_key

from django.db import models
from django.utils import timezone

from annoying.fields import JSONField
from annoying.functions import get_object_or_None

from .utils import compile_cmp, issue_cmp, new_dict, repr_attributes


@repr_attributes('name')
class Queue(models.Model):
    name = models.CharField(max_length=60)
    is_active = models.BooleanField(default=False)

    def get_components(self):
        poller = get_object_or_None(JiraPoller, queue=self)
        actuator = get_object_or_None(JenkinsActuator, queue=self)
        if poller is None or actuator is None:
            return ()

        filters = {
            a.from_buffer.pk: a
            for a in AutoFilter.objects.filter(
                queue=self, from_buffer__isnull=False, to_buffer__isnull=False)
        }

        components = [poller, poller.to_buffer]
        while filters:
            a = filters[components[-1].pk]
            del filters[components[-1].pk]
            components.extend([a, a.to_buffer])

        components.append(actuator)
        return components

    class Meta:
        ordering = ('name', )


@repr_attributes('name', 'queue.name')
class Buffer(models.Model):
    name = models.CharField(max_length=60)
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    cmp_function = models.TextField(blank=True)

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


@repr_attributes('key')
class Issue(models.Model):
    buffer = models.ForeignKey(Buffer, on_delete=models.CASCADE, related_name='issues', null=True)
    key = models.CharField(max_length=30, unique=True, editable=False)
    props = JSONField(default=new_dict, editable=False)
    is_running = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


@repr_attributes('name', 'queue.name')
class Poller(models.Model):
    name = models.CharField(max_length=60)
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    to_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)
    interval = models.DurationField(default=timedelta(minutes=1))
    updated = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        abstract = True


@repr_attributes('name', 'queue.name')
class Filter(models.Model):
    name = models.CharField(max_length=60)
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT, related_name='to_filter')
    to_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT, related_name='from_filter')
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


@repr_attributes('name', 'queue.name')
class Actuator(models.Model):
    name = models.CharField(max_length=60)
    queue = models.OneToOneField(Queue, on_delete=models.PROTECT)
    from_buffer = models.OneToOneField(Buffer, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)

    class Meta:
        abstract = True


@repr_attributes('message')
class Log(models.Model):
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    created = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    class Meta:
        ordering = ('-id', )


class JiraPoller(Poller):
    query = models.CharField(max_length=1000)


class AutoFilter(Filter):
    pass


class JenkinsActuator(Actuator):
    project_name = models.CharField(max_length=60)
