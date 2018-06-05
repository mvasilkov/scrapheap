from datetime import datetime
import os
import time

from django.core.management.base import BaseCommand, CommandError

from integlib.logbook_utils import configure_logging

from queueapp.models import Queue, JiraPoller, AutoFilter, NopFilter, JenkinsActuator, Log

FULL_RUN_INTERVAL = 120  # do a full run each 2 minutes


def get_active_comp(comp_class, queue):
    return comp_class.objects.filter(queue=queue).exclude(is_active=False)


class Command(BaseCommand):
    help = 'Run the queueapp worker process'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.pid = os.getpid()
        self.first_run = True

    def handle(self, *args, **options):
        verbosity = int(options['verbosity'])
        configure_logging(verbose=verbosity > 1)

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
            jpoller = get_active_comp(JiraPoller, q).first()
            if jpoller:
                jpoller.run()

            nopfilters = get_active_comp(NopFilter, q)
            for filter in nopfilters:
                filter.run()

            autofilters = get_active_comp(AutoFilter, q)
            for filter in autofilters:
                filter.run()

            actuator = get_active_comp(JenkinsActuator, q).first()
            if actuator:
                actuator.run()

            Log.truncate_logs(q)
