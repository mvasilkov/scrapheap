import ast
from django.db import models
from django.db.backends.mysql.creation import DatabaseCreation
from tomoko.repaint import pixel_to_int, int_to_pixel

DatabaseCreation.data_types["CharField"] += " character set ascii collate ascii_bin"

class Point(models.Model):
    cons = models.CharField(max_length=900)
    value = models.PositiveIntegerField()

    def __unicode__(self):
        return "#%x" % self.value

    @staticmethod
    def from_mipmap(mm, u, v):
        point, not_used = Point.objects.get_or_create(
            cons=repr(tuple(mm.cons(u, v))),
            value=pixel_to_int(mm[u, v])
        )
        return point

    def image(self):
        for p in ast.literal_eval(self.cons):
            yield p
        yield int_to_pixel(self.value)

    class Meta:
        unique_together = ("cons", "value")
