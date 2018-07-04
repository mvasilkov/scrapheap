from fnmatch import fnmatchcase
from functools import cmp_to_key
import math

from django.db import models

from ..utils import compile_cmp, issue_cmp, repr_attributes

from .queue import Queue


@repr_attributes('name', 'queue.name')
class Buffer(models.Model):
    name = models.CharField(max_length=60)
    queue = models.ForeignKey(Queue, on_delete=models.PROTECT)
    cmp_function = models.TextField(blank=True)
    cmp_rules = models.TextField(blank=True, help_text='Move these issues to the top of the buffer. '
        'Shell-style patterns, one per line')

    def key_function(self):
        cmp = compile_cmp(self.cmp_function) if self.cmp_function else None
        if cmp is None:
            cmp = issue_cmp
        return cmp_to_key(cmp)

    def custom_ordering(self, buf):
        rules = [a.strip() for a in self.cmp_rules.splitlines()]
        b1 = []
        b2 = []

        for issue in buf:
            if self.issue_matches(issue, rules):
                b1.append(issue)
            else:
                b2.append(issue)

        return b1 + b2

    @staticmethod
    def issue_matches(issue, rules):
        for rule in rules:
            if fnmatchcase(issue.key, rule):
                return True
            for version in issue.fix_versions:
                if fnmatchcase(version, rule):
                    return True
        return False

    def get_ordered(self, *, count=None, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        buf = list(qs)
        if not buf:
            return None if count is None else []
        buf.sort(key=self.key_function())
        if self.cmp_rules.strip() != '':
            buf = self.custom_ordering(buf)
        if count is None:
            return buf[0]
        if count is math.inf:
            return buf
        return buf[:count]

    @property
    def ordered_issues(self):
        return self.get_ordered(count=math.inf, with_running=True)

    def get_ordered_without_versions(self, *, count=None, with_running=False, without_versions=None):
        if not without_versions:
            return self.get_ordered(count=count, with_running=with_running)
        buf1 = self.get_ordered(count=math.inf, with_running=with_running)
        buf = [a for a in buf1 if not set(a.fix_versions) & without_versions]
        if not buf:
            return None if count is None else []
        if count is None:
            return buf[0]
        if count is math.inf:
            return buf
        return buf[:count]

    def get_issues(self, *, count=None, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        return list(qs if count is None else qs[:count])

    def count(self, with_running=False):
        qs = self.issues.all() if with_running else self.issues.filter(is_running=False)
        return qs.count()
