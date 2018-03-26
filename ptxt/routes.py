from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, register_converter

from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token

from journal.converters import PathConverter
from journal.views import index, post, register, UserViewSet, PostViewSet

api_router = routers.DefaultRouter()
api_router.register('users', UserViewSet)
api_router.register('posts', PostViewSet)

register_converter(PathConverter, 'path')

urlpatterns = [
    path('api/auth/token/', obtain_jwt_token),
    path('api/', include(api_router.urls)),
    path('auth/register/', register, name='register'),
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('<path:user>/<path:path>/', post, name='post'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
