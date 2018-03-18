from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect

from rest_framework import viewsets

from .forms import RegistrationForm
from .models import Post
from .serializers import UserSerializer, PostSerializer


def index(request):
    posts = Post.objects.order_by('-pk')

    return render(request, 'journal/index.html', {'posts': posts})


def post(request, user: str, path: str):
    p = get_object_or_404(Post, user__username=user, path=path)

    return render(request, 'journal/post.html', {'p': p})


def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('index')
    else:
        form = RegistrationForm()

    return render(request, 'auth/register.html', {'form': form})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.order_by('-pk')
    serializer_class = PostSerializer
    lookup_field = 'objectid'
