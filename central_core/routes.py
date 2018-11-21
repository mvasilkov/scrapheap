from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, re_path

from queueapp.views import (
    index as queueapp_index,
    worker as queueapp_worker,
    history as queueapp_history,
    history_json as queueapp_history_json,
    buffer_json as queueapp_buffer_json,
    clear_attempted_multiple as queueapp_clear_attempted_multiple,
)
from dashboard.views import version_list as dashboard_versions
from conntest.views import conntest_json


def homepage(request):
    return redirect('queueapp_index')


urlpatterns = [
    path('', homepage, name='homepage'),
    path('queueapp/', queueapp_index, name='queueapp_index'),
    path('queueapp/json/buffer/<int:buffer_id>/', queueapp_buffer_json),
    path('queueapp/worker/', queueapp_worker, name='queueapp_worker'),
    path('queueapp/history/', queueapp_history, name='queueapp_history'),
    path('queueapp/history/json/<str:verdict>/', queueapp_history_json),
    path(
        'queueapp/clear_attempted_multiple/<int:buffer_id>/',
        queueapp_clear_attempted_multiple,
        name='queueapp_clear_attempted_multiple'),
    path('dashboard/versions/', dashboard_versions, name='dashboard_versions'),
    path('conntest.json', conntest_json),  # Task for interviews
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.contrib.staticfiles.views import serve

    urlpatterns += [
        re_path(r'^(favicon\.ico|robots\.txt)$', serve),
    ]
