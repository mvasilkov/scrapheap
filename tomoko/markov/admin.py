from django.contrib import admin
from tomoko.markov.models import Point

class PointAdmin(admin.ModelAdmin):
    pass

admin.site.register(Point, PointAdmin)
