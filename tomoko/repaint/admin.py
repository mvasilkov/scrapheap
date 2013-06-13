from django.contrib import admin
from tomoko.repaint.management.commands.load_pic import MM_LEVEL
from tomoko.repaint.models import Point
from tomoko.repaint.utils import inline_image

class PointAdmin(admin.ModelAdmin):
    list_display = ("__unicode__", "visual")

    def visual(self, obj):
        size = 4 * MM_LEVEL
        return ("<img src='data:image/png;base64,%s' width=%d height=%d>" %
            (inline_image(obj.image(), MM_LEVEL), size, size))

    visual.allow_tags = True

admin.site.register(Point, PointAdmin)
