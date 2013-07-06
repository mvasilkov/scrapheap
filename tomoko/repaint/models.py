import ast
from django.db import models
from django.db.backends.mysql.creation import DatabaseCreation
from tomoko.repaint import int_to_pixel

DatabaseCreation.data_types["CharField"] += " character set ascii collate ascii_bin"

class Point(models.Model):
    cons = models.CharField(max_length=900)
    val = models.PositiveIntegerField()
    is_basic = models.BooleanField()

    def __unicode__(self):
        return "#%06x" % self.val

    def loop(self):
        for p in ast.literal_eval(self.cons):
            yield (0, 0, 0) if p is None else p
        yield int_to_pixel(self.val)

    class Meta:
        unique_together = ("cons", "val")
