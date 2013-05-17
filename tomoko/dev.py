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
ROOT_URLCONF = "tomoko.routes"
SECRET_KEY = "Do you think I'm cute?"
