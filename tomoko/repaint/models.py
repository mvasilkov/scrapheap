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
    def from_mipmap(mm, start_i, start_j):
        end = mm.n_levels - 1
        start_i -= end
        start_j -= end
        result = []

        for j in xrange(mm.n_levels):
            for i in xrange(mm.n_levels):
                if i < -start_i or j < -start_j:
                    result.append(None)
                else:
                    level = max(end - i, end - j)
                    raw = mm.levels[level].getpixel((i + start_i, j + start_j))
                    result.append(raw)

        raw = result.pop()
        args = {"cons": repr(tuple(result)), "value": pixel_to_int(raw)}
        point, new = Point.objects.get_or_create(**args)
        return point

    def image(self):
        for p in ast.literal_eval(self.cons):
            yield p
        yield int_to_pixel(self.value)

    class Meta:
        unique_together = ("cons", "value")
