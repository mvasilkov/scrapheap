from datetime import datetime
import os
import time

from django.core.management.base import BaseCommand, CommandError

from queueapp.models import Queue, JiraPoller

FULL_RUN_INTERVAL = 120  # do a full run each 2 minutes


class Command(BaseCommand):
    help = 'Run the queueapp worker process'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.pid = os.getpid()
        self.first_run = True

    def handle(self, *args, **options):
        while True:
            self.stdout.write('---')
            started = datetime.now()
            self.stdout.write(f'Started a full run on {started}')

            self.full_run()
            self.first_run = False

            duration = datetime.now() - started
            self.stdout.write(f'The run took {duration}')
            duration_sec = duration.total_seconds()
            if duration_sec < FULL_RUN_INTERVAL:
                pause = FULL_RUN_INTERVAL - duration_sec
                self.stdout.write(f'Chilling for {pause} seconds')
                time.sleep(pause)

    def full_run(self):
        queues = list(Queue.objects.exclude(is_active=False))

        self.stdout.write('The following queues are active:')
        for q in queues:
            self.stdout.write(f'- {q.name}')
            if self.first_run:
                q.log(f'Worker process started, pid={self.pid}')

        for q in queues:
            jpoller = JiraPoller.objects.filter(queue=q).exclude(is_active=False).first()
            if jpoller:
                jpoller.run()
