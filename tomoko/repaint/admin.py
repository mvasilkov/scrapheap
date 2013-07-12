from django.conf import settings
from django.contrib import admin
from tomoko.repaint.models import Point
from tomoko.lib.inline import inline

class PointAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'visual', 'is_basic')
    list_filter = ('is_basic', )
    readonly_fields = ('pad_u', 'pad_v')

    def visual(self, obj):
        size = 4 * settings.RE_LEVEL
        return ('<img src=\'data:image/png;base64,%s\' width=%d height=%d>' %
            (inline(obj.loop(), settings.RE_LEVEL), size, size))

    visual.allow_tags = True

admin.site.register(Point, PointAdmin)
