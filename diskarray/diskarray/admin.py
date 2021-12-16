from django.contrib import admin

from .models import Disk, File, FileCopy, Oplog


@admin.register(Disk)
class DiskAdmin(admin.ModelAdmin):
    list_display = ('dev_name', 'mount_point', 'is_healthy')


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'size', 'readable_size')
    readonly_fields = ('size', 'sha256')


@admin.register(FileCopy)
class FileCopyAdmin(admin.ModelAdmin):
    pass


@admin.register(Oplog)
class OplogAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'error_code')
    readonly_fields = ('error_code', 'stdout', 'stderr')
