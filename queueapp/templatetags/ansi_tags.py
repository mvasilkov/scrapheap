from django import template
from django.utils.html import mark_safe

import ansi2html
from ansi2html.style import get_styles

register = template.Library()
conv = ansi2html.Ansi2HTMLConverter()


@register.filter(name='ansi')
def ansi(value):
    return conv.convert(value, full=False)


@register.simple_tag(name='ansi_styles')
def ansi_styles(scheme='mint-terminal', dark_bg=True):
    css = '\n'.join([str(a) for a in get_styles(dark_bg, scheme)])
    return mark_safe(css)
