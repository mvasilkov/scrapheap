from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, re_path

from queueapp.views import (
    index as queueapp_index,
    queue as queueapp_queue,
    worker as queueapp_worker,
    history as queueapp_history,
    history_json as queueapp_history_json,
    buffer_json as queueapp_buffer_json,
    clear_attempted_multiple as queueapp_clear_attempted_multiple,
    actuator_stop_start as queueapp_actuator_stop_start,
    queue_stop_start as queueapp_queue_stop_start,
)
from dashboard.views import (
    version_list as dashboard_versions,
    dist_status as dashboard_dist_status,
)
from conntest.views import conntest_json


def homepage(request):
    return redirect('queueapp_index')


urlpatterns = [
    path('', homepage, name='homepage'),
    path('queueapp/', queueapp_index, name='queueapp_index'),
    path('queueapp/<int:queue_id>/', queueapp_queue, name='queueapp_queue'),
    path('queueapp/json/buffer/<int:buffer_id>/', queueapp_buffer_json),
    path('queueapp/worker/', queueapp_worker, name='queueapp_worker'),
    path('queueapp/history/', queueapp_history, name='queueapp_history'),
    path('queueapp/history/json/<str:verdict>/', queueapp_history_json),
    path(
        'queueapp/clear_attempted_multiple/<int:buffer_id>/',
        queueapp_clear_attempted_multiple,
        name='queueapp_clear_attempted_multiple'),
    path(
        'queueapp/actuator_stop_start/<int:actuator_id>/',
        queueapp_actuator_stop_start,
        name='queueapp_actuator_stop_start'),
    path(
        'queueapp/queue_stop_start/<int:queue_id>/',
        queueapp_queue_stop_start,
        name='queueapp_queue_stop_start'),
    path('dashboard/versions/', dashboard_versions, name='dashboard_versions'),
    path('dashboard/dist-status/', dashboard_dist_status, name='dashboard_dist_status'),
    path('conntest.json', conntest_json),  # Task for interviews
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.contrib.staticfiles.views import serve

    urlpatterns += [
        re_path(r'^(favicon\.ico|robots\.txt)$', serve),
    ]
