from django.core.cache import cache
from django.shortcuts import render

from integlib.integ_status import get_versions_info


def query_infinibox_versions():
    key = 'infinibox_versions_status'
    result = cache.get(key)
    if result is not None:
        return result
    result = get_versions_info()
    cache.set(key, result, 120)
    return result


def version_list(request):
    return render(request, 'dashboard/versions.html', {
        'versions': query_infinibox_versions(),
    })
