from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render

from rest_framework import viewsets

from .models import Post
from .serializers import UserSerializer, PostSerializer


def index(request):
    posts = Post.objects.order_by('-pk')

    return render(request, 'journal/index.html', {'posts': posts})


def post(request, user: str, path: str):
    p = get_object_or_404(Post, user__username=user, path=path)

    return render(request, 'journal/post.html', {'p': p})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-pk')
    serializer_class = PostSerializer
    lookup_field = 'objectid'
