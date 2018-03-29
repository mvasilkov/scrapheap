from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Post


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField('user-detail', lookup_field='username')

    class Meta:
        model = User
        fields = ('url', 'username', 'first_name', 'last_name', 'email')


class PostSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField('post-detail', lookup_field='objectid')
    user = UserSerializer(read_only=True)

    # user = serializers.HyperlinkedRelatedField(
    #     'user-detail', lookup_field='username', read_only=True)

    class Meta:
        model = Post
        fields = ('url', 'objectid', 'user', 'path', 'contents_html', 'created', 'updated')
