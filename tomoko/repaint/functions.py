from cdist import cdist
from django.conf import settings
import ujson
from tomoko.lib.mat import mat_rows, mat_cols, mat_null
from tomoko.repaint import int_to_pixel
from tomoko.repaint.models import Point


def cons_dist(a, b):
    assert len(a) == len(b)
    return sum(cdist(*args) for args in zip(a, b) if args != (None, None))


def find_points(ref):
    md = cdist((0, 0, 0), (255, 255, 255)) * settings.RE_LEVEL ** 2
    found = ()
    if ref[0] is None:
        _cons = ref + ('x', )
        pad_u = mat_null(mat_cols, _cons, settings.RE_LEVEL)
        pad_v = mat_null(mat_rows, _cons, settings.RE_LEVEL)
    else:
        pad_u = pad_v = 0
    for p in Point.objects.filter(is_basic=True, pad_u=pad_u, pad_v=pad_v):
        pc = ujson.loads(p.cons)
        d = cons_dist(ref, pc)
        if d < md:
            md = d
            found = (p, )
        elif d == md:
            found += (p, )
    assert len(found)
    return found


def find_values(points):
    md = cdist((0, 0, 0), (255, 255, 255)) * len(points)
    found = ()
    pcs = tuple(int_to_pixel(p.val) for p in points)
    for val in (Point.objects.filter(is_basic=True)
                .values_list('val', flat=True).distinct()):
        ref = int_to_pixel(val)
        d = sum(cdist(ref, pc) for pc in pcs)
        if d < md:
            md = d
            found = (val, )
        elif d == md:
            found += (val, )
    assert len(found)
    return found
