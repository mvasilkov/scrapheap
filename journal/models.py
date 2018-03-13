from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils.encoding import iri_to_uri

from mongo.objectid import ObjectId


def _objectid():
    return str(ObjectId())


class Post(models.Model):
    path_validator = UnicodeUsernameValidator()

    objectid = models.CharField(max_length=24, default=_objectid, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='posts')
    path = models.CharField(max_length=127, validators=[path_validator])
    contents = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        # The string returned from get_absolute_url() must contain only ASCII characters.
        return iri_to_uri(f'/{self.user}/{self.path}/')

    def __str__(self):
        return f'Post({self.user}/{self.path})'

    class Meta:
        unique_together = ('user', 'path')
