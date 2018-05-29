from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, re_path

from queueapp.views import (
    index as queueapp_index,
    history as queueapp_history,
    history_json as queueapp_history_json,
)


def homepage(request):
    return redirect('queueapp_index')


urlpatterns = [
    path('', homepage, name='homepage'),
    path('queueapp/', queueapp_index, name='queueapp_index'),
    path('queueapp/history/', queueapp_history, name='queueapp_history'),
    path('queueapp/history/json/<str:verdict>/', queueapp_history_json),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.contrib.staticfiles.views import serve

    urlpatterns += [
        re_path(r'^(favicon\.ico|robots\.txt)$', serve),
    ]
