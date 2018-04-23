from django import template
from django.utils.safestring import mark_safe

from inflection import underscore

register = template.Library()


@register.filter
def comp_template(comp):
    return underscore(comp.__class__.__name__) + '.html'


@register.filter
def is_active_icon(comp):
    a = 'full' if comp.is_active else 'low'
    return mark_safe(
        f'<img src="/static/icons/{a}-battery-16.png" class="is-active-icon" width=16 height=16>')
