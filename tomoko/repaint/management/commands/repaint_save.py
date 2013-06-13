from django.core.management.base import LabelCommand
from tomoko.repaint import Canvas, int_to_pixel
from tomoko.repaint.management.commands.repaint_load import MM_LEVEL
from tomoko.repaint.models import Point
from tomoko.repaint.utils import progress_bar

MM_SIZE = 250

class Command(LabelCommand):
    def handle_label(self, label, **options):
        canvas = Canvas(size=MM_SIZE, n_levels=MM_LEVEL)
        size = MM_SIZE ** 2
        done = 0
        for v in xrange(MM_SIZE):
            for u in xrange(MM_SIZE):
                cons = tuple(canvas.cons(u, v))
                point = Point.random_by_cons(cons)
                if point is None:
                    canvas.save(label)
                    print "Eat flaming death"
                    return
                canvas.paint(u, v, int_to_pixel(point.value))
                done += 1
                if done % 4000 == 0:
                    print progress_bar(done, size)
        canvas.save(label)
