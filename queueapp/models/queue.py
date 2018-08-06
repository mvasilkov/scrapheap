from django.db import models

from annoying.functions import get_object_or_None

from ..utils import repr_attributes


@repr_attributes('name')
class Queue(models.Model):
    name = models.CharField(max_length=60)
    is_active = models.BooleanField(default=False)

    def get_filters(self):
        from .filters import AutoFilter, NopFilter

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
        from .pollers import JiraPoller
        from .actuators import JenkinsActuator

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
        return list(self.logs.order_by('-pk')[:20])

    class Meta:
        ordering = ('name', )


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
