from defaults import emplace

emplace()

# Application definition

INSTALLED_APPS += [
    'journal',
]

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': (DJANGO_ROOT / 'local_storage' / 'db.sqlite3').as_posix(),
    }
}

# Cache
# https://docs.djangoproject.com/en/2.0/topics/cache/

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Authentication
# https://docs.djangoproject.com/en/2.0/topics/auth/

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
]

# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 6,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'Israel'

USE_I18N = USE_L10N = USE_TZ = False

# Static files
# https://docs.djangoproject.com/en/2.0/howto/static-files/

MEDIA_ROOT = (DJANGO_ROOT / 'local_storage' / 'media').as_posix()

MEDIA_URL = '/media/'

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'yarn.finders.YarnFinder',
]

YARN_ROOT_PATH = DJANGO_ROOT.as_posix()

YARN_STATIC_FILES_PREFIX = 'node_modules'
