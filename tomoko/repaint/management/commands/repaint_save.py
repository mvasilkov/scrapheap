from django.core.management.base import LabelCommand
from optparse import make_option
from tomoko.repaint import Canvas, int_to_pixel
from tomoko.repaint.management.commands.repaint_load import MM_LEVEL
from tomoko.repaint.models import Point
from tomoko.repaint.reiterate import reiterate
from tomoko.repaint.utils import progress_bar

MM_SIZE = 250

class Command(LabelCommand):
    option_list = LabelCommand.option_list + (
        make_option("--size", type="int", default=0, dest="size"),
    )

    def handle_label(self, label, **options):
        size = options["size"] or MM_SIZE
        canvas = Canvas(size, n_levels=MM_LEVEL)
        stack = []
        p_end = size ** 2
        p_val = 0
        for u, v in reiterate(size):
            cons = tuple(canvas.cons(u, v))
            point, others = Point.random_by_cons(cons)
            if point is None:
                canvas.save(label)
                print "Eat flaming death"
                continue
            if others:
                stack.append((u, v, others))
            canvas.paint(u, v, int_to_pixel(point.value))
            p_val += 1
            if p_val % 4000 == 0:
                canvas.save(label)
                print progress_bar(p_val, p_end)
        canvas.save(label)
