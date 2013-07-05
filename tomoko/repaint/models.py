from django.db import models
from django.db.backends.mysql.creation import DatabaseCreation

DatabaseCreation.data_types["CharField"] += " character set ascii collate ascii_bin"

class Point(models.Model):
    cons = models.CharField(max_length=900)
    value = models.PositiveIntegerField()
    is_basic = models.BooleanField()

    def __unicode__(self):
        return "#%06x" % self.value

    class Meta:
        unique_together = ("cons", "value")
