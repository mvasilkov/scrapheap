from django.contrib import admin

from .models import Queue, Buffer, Issue, JiraPoller, AutoFilter, JenkinsActuator


@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    pass


@admin.register(Buffer)
class BufferAdmin(admin.ModelAdmin):
    pass


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
