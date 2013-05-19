from django.db import models

class Point(models.Model):
    cons = models.CharField(max_length=200)
    value = models.PositiveIntegerField()

    def __unicode__(self):
        return "#%x" % self.value
