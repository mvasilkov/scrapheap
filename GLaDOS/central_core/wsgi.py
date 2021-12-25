from django.core.wsgi import get_wsgi_application

from defaults import setenv

__all__ = ['application']

setenv()
application = get_wsgi_application()
