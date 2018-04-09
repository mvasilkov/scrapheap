from defaults import emplace

emplace()

# Application definition

INSTALLED_APPS += [
    'queueapp',
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
