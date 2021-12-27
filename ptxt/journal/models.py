from django.core.validators import MinLengthValidator
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.encoding import iri_to_uri

from mongo.objectid import ObjectId
from mur.commonmark import commonmark


def _objectid():
    return str(ObjectId())


class Post(models.Model):
    path_validators = [MinLengthValidator(6), UnicodeUsernameValidator()]

    objectid = models.CharField(max_length=24, default=_objectid, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='posts')
    path = models.CharField(max_length=127, validators=path_validators)
    contents = models.TextField()
    contents_html = models.TextField(default='', editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        # The string returned from get_absolute_url() must contain only ASCII characters.
        return iri_to_uri(f'/{self.user}/{self.path}/')

    def __str__(self):
        return f'Post({self.user}/{self.path})'

    class Meta:
        unique_together = ('user', 'path')


@receiver(pre_save, sender=Post)
def update_html(sender, instance, update_fields, **kwargs):
    if update_fields and 'contents' not in update_fields:
        return
    instance.contents_html = commonmark(instance.contents)
