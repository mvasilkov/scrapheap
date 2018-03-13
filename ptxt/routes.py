from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, register_converter

from journal.converters import PathConverter
from journal.views import index, post

register_converter(PathConverter, 'path')

urlpatterns = [
    path('', index, name='index'),
    path('<path:user>/<path:path>/', post, name='post'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
