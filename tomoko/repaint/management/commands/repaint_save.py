from django.core.management.base import LabelCommand
from optparse import make_option
from random import SystemRandom
from tomoko.repaint import Canvas, int_to_pixel
from tomoko.repaint.management.commands.repaint_load import MM_LEVEL
from tomoko.repaint.models import Point
from tomoko.repaint.reiterate import reiterate, goto_after
from tomoko.repaint.utils import progress_bar

MM_SIZE = 250

_random = SystemRandom()

class Command(LabelCommand):
    option_list = LabelCommand.option_list + (
        make_option("--size", type="int", default=0, dest="size"),
    )

    def handle_label(self, label, **options):
        size = options["size"] or MM_SIZE
        canvas = Canvas(size, n_levels=MM_LEVEL)
        stack = []
        p_end = size ** 2
        p_nop = 4000
        for u, v in reiterate(size):
            cons = tuple(canvas.cons(u, v))
            point, others = Point.random_by_cons(cons)
            if point is None:
                u, v, others = stack.pop()
                point = Point.objects.get(id=_random.choice(others))
                others.remove(point.id)
                goto_after(u, v)
            if others:
                stack.append((u, v, others))
            canvas.paint(u, v, int_to_pixel(point.value))
            p_nop -= 1
            if not p_nop:
                canvas.save(label)
                print progress_bar(v * size + u, p_end)
                p_nop = 4000
        canvas.save(label)
