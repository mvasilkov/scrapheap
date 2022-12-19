from datetime import datetime
from pathlib import Path
import re

from bson import ObjectId
from flask import Flask, request, redirect

from .pages import render_start_page
from .models import Base, engine, Session, Post

OUR_ROOT = Path(__file__).parents[1]
UPLOAD_FOLDER = OUR_ROOT / 'static' / 'uploads'

app = Flask(__name__, static_folder=OUR_ROOT / 'static')


def is_superuser(request):
    return request.cookies.get('sessionId') == '014b5f09a295b8c2500a4c872d91fbf07ca10c41abb67caa5c65a8514e8493d3'


@app.route('/')
def start_page():
    return render_start_page(is_superuser(request))


@app.route('/publish', methods=['POST'])
def publish():
    if 'picture' not in request.files:
        return redirect('/')

    picture = request.files['picture']
    save_as = str(ObjectId()) + Path(picture.filename or 'x.png').suffix
    picture.save(UPLOAD_FOLDER / save_as)

    title = request.form.get('title', 'noname')
    # title = re.sub(r'script|onload', '', title, flags=re.I)

    session = Session()

    session.add(Post(title=title, picture=save_as))

    session.commit()
    session.close()

    return redirect('/')


@app.route('/delete/<int:post_id>')
def delete(post_id):
    if not is_superuser(request):
        return redirect('/')

    session = Session()

    post = session.query(Post).get(post_id)
    if post:
        session.delete(post)
        session.commit()

    session.close()

    return redirect('/')


# @app.route('/setcookie')
def setcookie():
    response = redirect('/')
    response.set_cookie(
        'sessionId', '014b5f09a295b8c2500a4c872d91fbf07ca10c41abb67caa5c65a8514e8493d3', expires=datetime(2030, 1, 1)
    )
    return response


if __name__ == '__main__':
    Base.metadata.create_all(bind=engine)

    app.run()
