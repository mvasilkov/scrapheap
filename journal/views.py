from django.shortcuts import get_object_or_404, render

from journal.models import Post


def index(request):
    posts = Post.objects.order_by('-pk')

    return render(request, 'journal/index.html', {'posts': posts})


def post(request, user: str, path: str):
    p = get_object_or_404(Post, user__username=user, path=path)

    return render(request, 'journal/post.html', {'p': p})
