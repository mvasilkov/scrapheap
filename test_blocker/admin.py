from django.contrib import admin

from .models import TestBlocker


@admin.register(TestBlocker)
class TestBlockerAdmin(admin.ModelAdmin):
    list_display = ('test_name', 'issue_key')
    search_fields = ('test_name', 'issue_key')
