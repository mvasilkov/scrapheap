from datetime import datetime
from os.path import getsize
from subprocess import CalledProcessError

from django.core.management.base import BaseCommand, CommandError

from diskarray.models import Disk, File, FileCopy, Oplog
from diskarray.shell_commands import sha256


class Command(BaseCommand):
    help = 'Add existing file'

    def add_arguments(self, parser):
        parser.add_argument('path')

    def handle(self, *args, **options):
        self.stdout.write('---')
        path = options['path']
        if not path:
            raise CommandError('Path is required')

        self.stdout.write('Path = %s' % path)
        try:
            size = getsize(path)
        except OSError:
            raise CommandError('File not found | inaccessible')

        disk = Disk.containing_path(path)
        if not disk:
            raise CommandError('Unknown disk')

        self.stdout.write('Disk = %s' % disk)
        if not disk.is_mounted():
            raise CommandError('Disk is not mounted')

        try:
            shasum = sha256(path)
        except CalledProcessError as err:
            oplog = Oplog(
                command=err.cmd,
                stage=Oplog.ENDED,
                error_code=err.returncode,
                stdout=err.stdout,
                stderr=err.stderr)
            oplog.save()
            raise

        self.stdout.write('SHA-256 = %s' % shasum)
        try:
            existing_file = File.objects.get(sha256=shasum)
        except File.DoesNotExist:
            existing_file = None
        else:
            raise CommandError('Existing file: %s' %
                               (existing_file.vpath or '(vpath is empty)'))

        file = File(vpath='', size=size, sha256=shasum)
        file.save()

        copy = FileCopy(
            disk=disk,
            file=file,
            path=path,
            is_healthy=True,
            last_checked=datetime.now())
        copy.save()
