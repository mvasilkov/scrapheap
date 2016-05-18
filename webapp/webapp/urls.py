from django.conf.urls import url
from django.contrib import admin
from django.views import defaults
from shortener import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.submit, name='submit'),
    url(r'^success/(?P<short_url>[\w-]+)$', views.success, name='success'),
    url(r'^(?P<short_url>[\w-]+)$', views.redirect_view, name='redirect'),
    url(r'^404/Not/Found()$', defaults.page_not_found),
]
