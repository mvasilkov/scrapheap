from django.contrib import admin
from django.utils.safestring import mark_safe
from django.utils.text import Truncator

from .models import Queue, Buffer, Issue, JiraPoller, AutoFilter, JenkinsActuator


@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')


@admin.register(Buffer)
class BufferAdmin(admin.ModelAdmin):
    list_display = ('queue_name', 'cmp_function_pre')

    def queue_name(self, model):
        return model.queue.name

    queue_name.short_description = 'queue'
    queue_name.admin_order_field = 'queue__name'

    def short_cmp_function(self, model):
        return Truncator(model.cmp_function).words(6)

    short_cmp_function.short_description = 'compare function'
    short_cmp_function.admin_order_field = 'cmp_function'

    def cmp_function_pre(self, model):
        return mark_safe(
            f'<pre style="margin: 0; padding: 0"><code>{model.cmp_function}</code></pre>')

    cmp_function_pre.short_description = 'compare function'
    cmp_function_pre.admin_order_field = 'cmp_function'


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    pass


@admin.register(JiraPoller)
class PollerAdmin(admin.ModelAdmin):
    pass


@admin.register(AutoFilter)
class FilterAdmin(admin.ModelAdmin):
    pass


@admin.register(JenkinsActuator)
class ActuatorAdmin(admin.ModelAdmin):
    pass
