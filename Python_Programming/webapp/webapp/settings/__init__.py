from .base import *

DEBUG = True

SECRET_KEY = 'k!ss$^@iwoz42hiq$8=w1-v6o^(syh41twnc(h0+t7sc#)=nls'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'webapp',
        'USER': 'django',
        'PASSWORD': 'unchained',
    }
}
