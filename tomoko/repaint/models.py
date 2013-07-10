import ast
from django.conf import settings
from django.db import models
from django.db.backends.mysql.creation import DatabaseCreation
from django.db.models.signals import pre_save
from django.dispatch import receiver
from random import SystemRandom
from tomoko.lib.mat import mat_rows, mat_cols, mat_null
from tomoko.repaint import int_to_pixel

DatabaseCreation.data_types["CharField"] += " character set ascii collate ascii_bin"

_random = SystemRandom()

class PointManager(models.Manager):
    def random_by_cons(self, cons):
        if not isinstance(cons, str):
            cons = repr(cons)
        options = self.filter(cons=cons).values_list('id', flat=True)
        if not options:
            return None
        return self.get(id=_random.choice(options))

class Point(models.Model):
    cons = models.CharField(max_length=900)
    val = models.PositiveIntegerField()
    is_basic = models.BooleanField(db_index=True)
    pad_u = models.PositiveSmallIntegerField()
    pad_v = models.PositiveSmallIntegerField()

    objects = PointManager()

    def __unicode__(self):
        return "#%06x" % self.val

    def loop(self, replace_none=(0, 0, 0)):
        for p in ast.literal_eval(self.cons):
            yield replace_none if p is None else p
        yield int_to_pixel(self.val)

    class Meta:
        unique_together = (('cons', 'val'), )
        index_together = (('pad_u', 'pad_v'), )

@receiver(pre_save, sender=Point)
def update(sender, instance, **kwargs):
    cons = tuple(instance.loop(None))
    instance.pad_u = mat_null(mat_cols, cons, settings.RE_LEVEL)
    instance.pad_v = mat_null(mat_rows, cons, settings.RE_LEVEL)
