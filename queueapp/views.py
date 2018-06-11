import psutil
import traceback

from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

from .management.commands.worker import PROCNAME, TEEFILE
from .models import Queue, Issue, Buffer


def index(request):
    queues = Queue.objects.order_by('name')

    return render(request, 'queueapp/index.html', {
        'queues': queues,
    })


def worker(request):
    processes = [p.info for p in psutil.process_iter(attrs=['cmdline', 'name'])]
    pid = None

    for p in processes:
        if p['name'].startswith(PROCNAME):
            pid = p.split(':')[1]
            break

        if not p['cmdline']:
            continue

        cmdline = ' '.join(p['cmdline']).rstrip()
        if cmdline.startswith(PROCNAME):
            pid = cmdline.split(':')[1]
            break

    if pid is None:
        contents = 'Not started'
    else:
        try:
            infile = open(f'{TEEFILE}.{pid}', 'r', encoding='utf-8')
            contents = infile.read()
        except:
            contents = traceback.format_exc()

    return render(request, 'queueapp/worker.html', {
        'contents': contents,
    })


def history(request):
    issues_succeeded = Issue.objects.filter(
        buffer=None, verdict=Issue.VERDICT_SUCCEEDED).order_by('-updated')[:20]
    issues_failed = Issue.objects.filter(
        buffer=None, verdict=Issue.VERDICT_FAILED).order_by('-updated')[:20]

    return render(request, 'queueapp/history.html', {
        'issues_succeeded': issues_succeeded,
        'issues_failed': issues_failed,
    })


def history_json(request, verdict: str):
    valid = {Issue.VERDICT_SUCCEEDED, Issue.VERDICT_FAILED}
    if verdict not in valid:
        return HttpResponse(
            '{"error": "Valid args are /%s/ and /%s/"}' % tuple(valid),
            content_type='application/json')
    issues = Issue.objects.filter(buffer=None, verdict=verdict).order_by('-updated')[:20]
    return HttpResponse(serialize('json', issues), content_type='application/json')


def buffer_json(request, buffer_id: int):
    buf = get_object_or_404(Buffer, id=buffer_id)
    return HttpResponse(serialize('json', buf.ordered_issues), content_type='application/json')
