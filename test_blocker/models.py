from django.db import models

from queueapp.utils import repr_attributes


@repr_attributes('test_name')
class TestBlocker(models.Model):
    test_name = models.CharField(max_length=1000)
    issue_key = models.CharField(max_length=64)
