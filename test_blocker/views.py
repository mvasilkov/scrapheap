from django.core.serializers import serialize
from django.http import HttpResponse

from .models import TestBlocker


def test_blocker_json(request):
    tb = TestBlocker.objects.all()
    return HttpResponse(serialize('json', tb), content_type='application/json')
