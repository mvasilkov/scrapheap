from django.db import models

class TargetUrl(models.Model):
    url = models.URLField()

    def __str__(self):
        return self.url

    def get_absolute_url(self):
        return self.url
