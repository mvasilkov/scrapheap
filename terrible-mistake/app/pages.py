import html

from .models import Post, Session

TEMPLATE_BASE = '''<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>noname</title>
        <link rel="stylesheet" href="/static/app.css">
    </head>
    <body>
        %s
    </body>
</html>
'''

TEMPLATE_FORM = '''
<form action="/publish" method="post" enctype="multipart/form-data">
    <label for="title">Title</label>
    <input type="text" name="title" id="title" placeholder=""><br>
    <label for="picture">Picture</label>
    <input type="file" name="picture" id="picture"><br>
    <button type="submit">Publish</button>
</form>
'''

TEMPLATE_POST = '''
<div class="post">
    <img src="/static/uploads/%s" title="%s"><br>
    <span class="title">%s</span>
</div>
'''

TEMPLATE_POST_SUPERUSER = '''
<div class="post">
    <img src="/static/uploads/%s" title="%s"><br>
    <span class="title">%s</span><br>
    <a href="/delete/%d" class="delete">Delete</a>
</div>
'''


def render_start_page(is_superuser: bool):
    session = Session()

    posts = session.query(Post).order_by(Post.id.desc()).all()
    if is_superuser:
        rendered_posts = ''.join(
            TEMPLATE_POST_SUPERUSER
            % (
                post.picture,
                post.title,
                html.escape(post.title),
                post.id,
            )
            for post in posts
        )
    else:
        rendered_posts = ''.join(
            TEMPLATE_POST
            % (
                post.picture,
                post.title,
                html.escape(post.title),
            )
            for post in posts
        )

    session.close()

    return TEMPLATE_BASE % ''.join([TEMPLATE_FORM, rendered_posts])
