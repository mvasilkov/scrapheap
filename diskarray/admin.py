from django.contrib import admin

from .models import Disk, File, FileCopy, Oplog


@admin.register(Disk)
class DiskAdmin(admin.ModelAdmin):
    pass


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    pass


@admin.register(FileCopy)
class FileCopyAdmin(admin.ModelAdmin):
    pass


@admin.register(Oplog)
class OplogAdmin(admin.ModelAdmin):
    pass
