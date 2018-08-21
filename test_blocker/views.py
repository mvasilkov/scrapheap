from django.conf import settings
from django.core.serializers import serialize
from django.http import HttpResponse

from .models import TestBlocker


def test_blocker_json(request):
    tb = TestBlocker.objects.all()
    return HttpResponse(serialize('json', tb), content_type='application/json')


def conntest_json(request):  # Task for interviews
    contents = open(
        (settings.DJANGO_ROOT / 'test_blocker' / 'conntest.json').as_posix(),
        encoding='utf-8').read()
    return HttpResponse(contents, content_type='application/json')
