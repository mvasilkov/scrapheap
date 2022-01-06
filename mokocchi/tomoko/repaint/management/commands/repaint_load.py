from PIL import Image
from django.conf import settings
from django.core.management.base import LabelCommand
from tomoko.repaint.picture import Picture


class Command(LabelCommand):
    def handle_label(self, label, **options):
        im = Image.open(label)
        pic = Picture(im, settings.RE_LEVEL)

        usize, vsize = im.size
        for v in xrange(vsize):
            for u in xrange(usize):
                pic.point_at(u, v)
