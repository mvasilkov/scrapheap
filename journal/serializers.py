from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Post


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField('user-detail', lookup_field='username')

    class Meta:
        model = User
        fields = ('url', 'username', 'first_name', 'last_name', 'email')


class BasicUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ('url', 'username')


class PostSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField('post-detail', lookup_field='objectid')
    user = BasicUserSerializer(read_only=True, default=serializers.CreateOnlyDefault(serializers.CurrentUserDefault()))

    # user = serializers.HyperlinkedRelatedField(
    #     'user-detail', lookup_field='username', read_only=True)

    class Meta:
        model = Post
        fields = ('url', 'objectid', 'user', 'path', 'contents_html', 'created', 'updated')
