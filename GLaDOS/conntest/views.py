from django.conf import settings
from django.http import HttpResponse


def conntest_json(request):  # Task for interviews
    contents = open(
        (settings.DJANGO_ROOT / 'conntest' / 'conntest.json').as_posix(),
        encoding='utf-8').read()
    return HttpResponse(contents, content_type='application/json')
