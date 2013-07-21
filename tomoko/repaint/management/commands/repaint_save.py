from django.conf import settings
from django.core.management.base import LabelCommand
from json import dumps as repr
from optparse import make_option
from tomoko.repaint.functions import find_points, find_values
from tomoko.repaint.models import Point
from tomoko.repaint.picture import Canvas


class Command(LabelCommand):
    option_list = LabelCommand.option_list + (
        make_option('--size', type='int', default=0, dest='size'),
    )

    def handle_label(self, label, **options):
        size = options['size'] or settings.RE_SIZE
        canvas = Canvas(size, settings.RE_LEVEL)

        for v in xrange(size):
            for u in xrange(size):
                cons = tuple(canvas.cons_at(u, v))
                point = Point.objects.random_by_cons(cons)
                if point is None:
                    print 'I can haz moar data?'
                    points = find_points(cons)
                    if len(points) == 1:
                        (p, ) = points
                        print 'I can haz (%s)' % p
                        point = Point(cons=repr(cons), val=p.val)
                        point.save()
                    else:
                        print 'I can haz:'
                        values = find_values(points)
                        for val in values:
                            p = Point(cons=repr(cons), val=val)
                            p.save()
                            print '@ (%s)' % p
                        point = Point.objects.random_by_cons(cons)
                canvas.paint(u, v, point.val)
            canvas.save(label)

        canvas.save(label)
