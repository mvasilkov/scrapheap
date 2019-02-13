GLaDOS
======

**Development environment**

Ensure nodejs and yarn are installed:

    brew install yarn

Create virtualenv:

    python3 -m venv ~/path/to/venv

Once virtualenv is active, install requirements and integlib:

    pip install -r requirements.txt
    pip install -e <integrate.git>/integlib
    pip install -e <integrate.git>/apps/auto_integ

**Starting the server in development**

To start the server:

    ./manage.py runserver

If you get an error `Failed to find libmagic. Check your installation.`:

    brew install libmagic

To copy the database from production:

    scp rei@<prod-hostname>:glados/db.sqlite3 .

To create the databse from scratch:

    ./manage.py migrate
    ./manage.py createsuperuser

To create dummy content in your new database:

    ./initial_contents.py

To update the database structure after changing model code:

    ./manage.py makemigrations
    ./manage.py migrate

**Accessing the frontend**

Application frontend: http://localhost:8000/queueapp/

Admin panel: http://localhost:8000/admin/

**Starting the backend worker in development**

Don't do this while production is running!

    ./manage.py worker

**Running tests**

To run the tests:

    pytest

**Starting the server in production**

The app runs on uWSGI, with nginx as a reverse proxy in front of it.

    systemctl start glados
    systemctl status glados

The symlinks are as follows:

    /etc/systemd/system/glados.service -> {repo}/server/uwsgi.service
    /etc/systemd/system/glados-worker.service -> {repo}/server/queueapp-worker.service
    /etc/nginx/sites-enabled/glados.conf -> {repo}/server/glados.conf
