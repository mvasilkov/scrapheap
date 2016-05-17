from django.contrib import admin
from .models import TargetUrl

@admin.register(TargetUrl)
class TargetUrlAdmin(admin.ModelAdmin):
    pass
