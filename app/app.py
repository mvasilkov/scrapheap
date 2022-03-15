from pathlib import Path
import re

from bson import ObjectId
from flask import Flask, request, redirect

from .pages import render_start_page
from .models import Base, engine, Session, Post

OUR_ROOT = Path(__file__).parents[1]
UPLOAD_FOLDER = OUR_ROOT / 'static' / 'uploads'

app = Flask(__name__, static_folder=OUR_ROOT / 'static')


@app.route('/')
def start_page():
    return render_start_page()


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


if __name__ == '__main__':
    Base.metadata.create_all(bind=engine)

    app.run()
