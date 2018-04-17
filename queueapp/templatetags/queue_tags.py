from django import template

from inflection import underscore

register = template.Library()


@register.filter
def comp_template(comp):
    return underscore(comp.__class__.__name__) + '.html'
