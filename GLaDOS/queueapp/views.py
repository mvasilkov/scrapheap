import psutil
import traceback

from django.core.serializers import serialize
from django.http import HttpResponse
from django.http.response import HttpResponseNotAllowed
from django.shortcuts import render, get_object_or_404, redirect

from .management.commands.worker import PROCNAME, TEEFILE
from .models import Queue, Issue, Buffer, JenkinsActuator


def index(request):
    queues = Queue.objects.order_by('name')

    return render(request, 'queueapp/select_queue.html', {
        'queues': queues,
        'event_log': False,
    })


def queue(request, queue_id):
    queue = get_object_or_404(Queue, id=queue_id)
    queues = Queue.objects.order_by('name')  # For nav

    return render(request, 'queueapp/index.html', {
        'queue': queue,
        'queues': queues,
        'event_log': True,
    })


def worker(request):
    processes = [p.info for p in psutil.process_iter(attrs=['cmdline', 'name'])]
    pid = None

    for p in processes:
        if p['name'].startswith(PROCNAME):
            pid = p['name'].split(':')[1]
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


def clear_attempted_multiple(request, buffer_id: int):
    if request.method == 'POST':
        buf = get_object_or_404(Buffer, id=buffer_id)
        for issue in buf.get_issues():
            issue.props.pop(Issue.ATTEMPTED_MULTIPLE, None)
            issue.save()
        return redirect('queueapp_index')

    return HttpResponseNotAllowed(permitted_methods=['POST'])


def actuator_stop_start(request, actuator_id: int):
    if request.method == 'POST':
        act = get_object_or_404(JenkinsActuator, id=actuator_id)
        act.is_active = not act.is_active
        act.save()
        return redirect('queueapp_index')

    return HttpResponseNotAllowed(permitted_methods=['POST'])


def queue_stop_start(request, queue_id: int):
    if request.method == 'POST':
        queue = get_object_or_404(Queue, id=queue_id)
        queue.is_active = not queue.is_active
        queue.save()

        for buffer in Buffer.objects.filter(queue=queue):
            for issue in buffer.issues.all():
                issue.buffer = None
                issue.is_running = False
                issue.save()

        return redirect('queueapp_index')

    return HttpResponseNotAllowed(permitted_methods=['POST'])
