from django.contrib import admin
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.text import Truncator

from .models import Queue, Buffer, Issue, Log, JiraPoller, AutoFilter, NopFilter, JenkinsActuator


def escape_code(string):
    return mark_safe(f'<pre style="margin: 0; padding: 0"><code>{escape(string)}</code></pre>')


@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')


@admin.register(Buffer)
class BufferAdmin(admin.ModelAdmin):
    list_display = ('name', 'queue_name', 'cmp_function_pre')

    def queue_name(self, model):
        return model.queue.name

    queue_name.short_description = 'queue'
    queue_name.admin_order_field = 'queue__name'

    def short_cmp_function(self, model):
        return Truncator(model.cmp_function).words(6)

    short_cmp_function.short_description = 'compare function'
    short_cmp_function.admin_order_field = 'cmp_function'

    def cmp_function_pre(self, model):
        return escape_code(model.cmp_function)

    cmp_function_pre.short_description = 'compare function'
    cmp_function_pre.admin_order_field = 'cmp_function'


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('key', 'buffer_name', 'is_running', 'created', 'updated')

    def buffer_name(self, model):
        if model.buffer:
            return model.buffer.name
        return '—'

    buffer_name.short_description = 'buffer'
    buffer_name.admin_order_field = 'buffer__name'


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('queue_name', 'updated', 'message', 'count')
    list_filter = ('queue__name', )

    def queue_name(self, model):
        return model.queue.name

    queue_name.short_description = 'queue'
    queue_name.admin_order_field = 'queue__name'


@admin.register(JiraPoller)
class JiraPollerAdmin(admin.ModelAdmin):
    list_display = ('name', 'queue_name', 'query_pre', 'updated')

    def queue_name(self, model):
        return model.queue.name

    queue_name.short_description = 'queue'
    queue_name.admin_order_field = 'queue__name'

    def query_pre(self, model):
        return escape_code(model.query)

    query_pre.short_description = 'query'
    query_pre.admin_order_field = 'query'


@admin.register(AutoFilter)
class AutoFilterAdmin(admin.ModelAdmin):
    list_display = ('name', 'queue_name')

    def queue_name(self, model):
        return model.queue.name

    queue_name.short_description = 'queue'
    queue_name.admin_order_field = 'queue__name'


@admin.register(NopFilter)
class NopFilterAdmin(admin.ModelAdmin):
    list_display = ('name', 'queue_name')

    def queue_name(self, model):
        return model.queue.name

    queue_name.short_description = 'queue'
    queue_name.admin_order_field = 'queue__name'


@admin.register(JenkinsActuator)
class JenkinsActuatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'project_name')
