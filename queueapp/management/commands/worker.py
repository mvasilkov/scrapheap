import os

from django.core.management.base import BaseCommand, CommandError

from queueapp.models import Queue


class Command(BaseCommand):
    help = 'Run the queueapp worker process'

    pid = None

    def handle(self, *args, **options):
        self.pid = os.getpid()

        self.full_run()

    def full_run(self):
        self.stdout.write('---')
        queues = list(Queue.objects.exclude(is_active=False))

        self.stdout.write('The following queues are active:')
        for q in queues:
            self.stdout.write(f'- {q.name}')
            q.log(f'Worker process started, pid={self.pid}')
