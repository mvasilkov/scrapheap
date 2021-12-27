from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, register_converter

from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token

from journal.converters import PathConverter
from journal.views import index, post, register, UserViewSet, PostViewSet, current_user, journal_post

api_router = routers.DefaultRouter()
api_router.register('users', UserViewSet, 'user')
api_router.register('posts', PostViewSet, 'post')

register_converter(PathConverter, 'path')

urlpatterns = [
    path('api/auth/self/', current_user),
    path('api/auth/token/', obtain_jwt_token),
    path('api/journal/<path:user>/', PostViewSet.as_view({'get': 'list'})),
    path('api/journal/<path:user>/<path:path>/', journal_post),
    path('api/', include(api_router.urls)),
    path('auth/register/', register, name='register'),
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('<path:user>/<path:path>/', post, name='post'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
