from PIL import Image
import ast
from django.contrib import admin
from tomoko.markov.management.commands.load_pic import MM_LEVEL
from tomoko.markov.models import Point

try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

class PointAdmin(admin.ModelAdmin):
    list_display = ("__unicode__", "visual")

    def visual(self, obj):
        im = Image.new("RGB", (MM_LEVEL, ) * 2, None)
        pic = im.load()
        cons = ast.literal_eval(obj.cons)
        u = 0
        v = 0
        for p in cons:
            pic[u, v] = p or (0, 0, 0)
            u += 1
            if u == MM_LEVEL:
                u = 0
                v += 1
        assert u == v == MM_LEVEL - 1
        pval = ((obj.value & 0xff0000) >> 16,
                (obj.value & 0x00ff00) >> 8,
                (obj.value & 0x0000ff))
        pic[u, v] = pval

        out = StringIO()
        im.save(out, "PNG")
        result = out.getvalue().encode("base64")
        out.close()

        zoom = 4
        return ("<img src='data:image/png;base64,%s' width=%d height=%d>" %
            (result, MM_LEVEL * zoom, MM_LEVEL * zoom))

    visual.allow_tags = True

admin.site.register(Point, PointAdmin)
