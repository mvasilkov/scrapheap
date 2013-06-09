from django.db import models
from tomoko.markov import pixel_to_int

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

    class Meta:
        unique_together = ("cons", "value")
