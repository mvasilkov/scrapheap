from defaults import emplace

emplace()

INSTALLED_APPS += [
    'queueapp',
]

TIME_ZONE = 'Israel'

USE_I18N = USE_L10N = USE_TZ = False

# Static files
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'yarn.finders.YarnFinder',
]

YARN_ALLOW_FILES = [
    '*.css',
    '*.js',
]

YARN_ROOT_PATH = DJANGO_ROOT.as_posix()

YARN_STATIC_FILES_PREFIX = 'node_modules'
