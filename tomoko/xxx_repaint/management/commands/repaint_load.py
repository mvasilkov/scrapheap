from PIL import Image
from django.core.management.base import LabelCommand
from tomoko.repaint import Mipmap
from tomoko.repaint.models import Point
from tomoko.repaint.utils import progress_bar

MM_LEVEL = 5

class Command(LabelCommand):
    def handle_label(self, label, **options):
        im = Image.open(label)
        if im.mode != "RGB":
            im = im.convert("RGB")
        mm = Mipmap(im, n_levels=MM_LEVEL)

        width, height = im.size
        p_end = width * height
        p_val = 0
        for v in xrange(height):
            for u in xrange(width):
                Point.from_mipmap(mm, u, v)
                p_val += 1
                if p_val % 4000 == 0:
                    print progress_bar(p_val, p_end)
