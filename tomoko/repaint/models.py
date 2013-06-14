import ast
from django.db import models
from django.db.backends.mysql.creation import DatabaseCreation
from random import SystemRandom
from tomoko.repaint import pixel_to_int, int_to_pixel

DatabaseCreation.data_types["CharField"] += " character set ascii collate ascii_bin"

_random = SystemRandom()

class Point(models.Model):
    cons = models.CharField(max_length=900)
    value = models.PositiveIntegerField()

    def __unicode__(self):
        return "#%06x" % self.value

    @staticmethod
    def from_mipmap(mm, u, v):
        point, not_used = Point.objects.get_or_create(
            cons=repr(tuple(mm.cons(u, v))),
            value=pixel_to_int(mm[u, v])
        )
        return point

    @staticmethod
    def random_by_cons(cons):
        if not isinstance(cons, str):
            cons = repr(cons)
        points = Point.objects.filter(cons=cons).values_list("id", flat=True)
        if not points:
            return None, None
        point = Point.objects.get(id=_random.choice(points))
        others = list(points)
        others.remove(point.id)
        return point, others

    def image(self):
        for p in ast.literal_eval(self.cons):
            yield p
        yield int_to_pixel(self.value)

    class Meta:
        unique_together = ("cons", "value")
