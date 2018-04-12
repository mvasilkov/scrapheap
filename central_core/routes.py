from django.contrib import admin
from django.urls import path

from queueapp.views import index as queueapp_index

urlpatterns = [
    path('queueapp/', queueapp_index, name='queueapp_index'),
    path('admin/', admin.site.urls),
]
