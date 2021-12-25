'Release settings'

from .base import *

DEBUG = False

ALLOWED_HOSTS = ['*']  # This is fine, since the application is internal

SECRET_KEY = ('In the event that the weighted companion cube does speak, '
              'the Enrichment Center urges you to disregard its advice.')
