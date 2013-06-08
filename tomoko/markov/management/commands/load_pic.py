from PIL import Image
from django.core.management.base import LabelCommand
from tomoko.markov import Mipmap
from tomoko.markov.models import Point

MM_LEVEL = 5

class Command(LabelCommand):
    def handle_label(self, label, **options):
        im = Image.open(label)
        if im.mode != "RGB":
            im = im.convert("RGB")
        mm = Mipmap(im, n_levels=MM_LEVEL)

        width, height = im.size
        for v in xrange(height):
            for u in xrange(width):
                Point.from_mipmap(mm, u, v).save()
