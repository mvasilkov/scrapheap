from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

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
    permission_classes = (permissions.IsAdminUser,)


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    lookup_field = 'objectid'

    def get_queryset(self):
        if 'user' in self.kwargs:
            return Post.objects.filter(user__username=self.kwargs['user']).order_by('-pk')
        return Post.objects.order_by('-pk')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def journal_post(request, user: str, path: str):
    p = get_object_or_404(Post, user__username=user, path=path)
    serializer = PostSerializer(p, context={'request': request})
    return Response(serializer.data)
