from django.core.cache import cache
from django.shortcuts import render

from integlib.integ_status import get_versions_info

from .dist_utils import get_dist_status


def call_with_cache(key, function, timeout=120):
    result = cache.get(key)
    if result is not None:
        return result
    result = function()
    cache.set(key, result, timeout)
    return result


def version_list(request):
    return render(request, 'dashboard/versions.html', {
        'versions': call_with_cache('infinibox_versions_status', get_versions_info),
    })


def dist_status(request):
    return render(request, 'dashboard/dist-status.html', {
        'status': call_with_cache('dist_ftp_status', get_dist_status),
    })
