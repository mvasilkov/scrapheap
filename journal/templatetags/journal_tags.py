from django import template
from django.utils.safestring import mark_safe

from mur.commonmark import commonmark

register = template.Library()


@register.filter(name='commonmark')
def commonmark_filter(string):
    return mark_safe(commonmark(string)) if string else ''
