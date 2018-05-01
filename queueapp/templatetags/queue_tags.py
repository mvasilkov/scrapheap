from django import template
from django.utils.safestring import mark_safe

from inflection import underscore

register = template.Library()


@register.filter
def comp_template(comp):
    return underscore(comp.__class__.__name__) + '.html'


@register.filter
def is_active_icon(comp):
    a = 'green' if comp.is_active else 'red'
    return mark_safe(
        f'<img src="/static/icons/{a}-icon.png" class="is-active-icon" width=9 height=9>')
