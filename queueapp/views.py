from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import render

from .models import Queue, Issue


def index(request):
    queues = Queue.objects.order_by('name')

    return render(request, 'queueapp/index.html', {
        'queues': queues,
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
