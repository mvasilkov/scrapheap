from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path

from queueapp.views import index as queueapp_index

urlpatterns = [
    path('queueapp/', queueapp_index, name='queueapp_index'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    from django.contrib.staticfiles.views import serve

    urlpatterns += [
        re_path(r'^(favicon\.ico|robots\.txt)$', serve),
    ]
