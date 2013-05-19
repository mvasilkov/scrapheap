DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "mokocchi",
        "USER": "tomoko",
        "PASSWORD": "bakabaka",
        "OPTIONS": {
            "unix_socket": "/tmp/mysql-dev.sock",
        }
    }
}
DEBUG = True
INSTALLED_APPS = (
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
)
ROOT_URLCONF = "tomoko.routes"
SECRET_KEY = "Do you think I'm cute?"
STATIC_URL = "/static/"
