import ast
from cdist import cdist
from django.conf import settings
from tomoko.repaint.models import Point

def cons_dist(a, b):
    assert len(a) == len(b)
    return sum(cdist(*args) for args in zip(a, b))

def find_points(ref):
    md = cdist((0, 0, 0), (255, 255, 255)) * settings.RE_LEVEL ** 2
    found = ()
    for p in Point.objects.filter(is_basic=True):
        if p.cons.startswith('(None,'):
            continue
        pc = ast.literal_eval(p.cons)
        d = cons_dist(ref, pc)
        if d < md:
            md = d
            found = (p, )
        elif d == md:
            found += (p, )
    assert len(found)
    return found
