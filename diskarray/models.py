from datetime import datetime

from django.db import models
from humanfriendly import format_size

from .shell_commands import mount_lines


class Disk(models.Model):
    dev_name = models.CharField(max_length=20)
    mount_point = models.CharField(max_length=40)
    is_healthy = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '%s on %s' % (self.dev_name, self.mount_point)

    def is_mounted(self):
        for line in mount_lines():
            if line.startswith('%s ' % self):
                return True

        return False

    @staticmethod
    def containing_path(path):
        for disk in Disk.objects.all():
            if path.startswith(disk.mount_point):
                return disk

        return None


class File(models.Model):
    vpath = models.CharField(max_length=1000)
    size = models.BigIntegerField()
    sha256 = models.CharField(max_length=64, unique=True)
    storage_class = models.PositiveSmallIntegerField(default=1)
    gen = models.PositiveSmallIntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.vpath or '(vpath is empty)'

    def readable_size(self):
        return '%s (%s)' % (format_size(self.size, binary=True),
                            format_size(self.size))


class FileCopy(models.Model):
    NEVER = datetime(1970, 1, 1)

    disk = models.ForeignKey(Disk, on_delete=models.PROTECT)
    file = models.ForeignKey(File, on_delete=models.PROTECT, related_name='copies')
    path = models.CharField(max_length=1000)
    is_healthy = models.BooleanField()
    last_checked = models.DateTimeField(default=NEVER)
    created = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True)

    class Meta:
        unique_together = ('disk', 'file')
        verbose_name_plural = 'file copies'

    def __str__(self):
        return '(%s) %s' % (self.disk, self.path)


class Oplog(models.Model):
    WAITING = 'waiting'
    WORKING = 'working'
    ENDED = 'ended'
    STAGES = (WAITING, WAITING), (WORKING, WORKING), (ENDED, ENDED)

    command = models.CharField(max_length=1000)
    stage = models.CharField(max_length=10, choices=STAGES, default=WAITING)
    error_code = models.SmallIntegerField(default=-1)
    stdout = models.TextField()
    stderr = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '(%s) %s' % (self.stage, self.command)
