from django.shortcuts import render

from .models import Queue


def index(request):
    queues = Queue.objects.order_by('name')
    return render(request, 'queueapp/index.html', {
        'queues': queues,
    })
