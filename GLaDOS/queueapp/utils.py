from locale import strcoll
import sys
import traceback

from .integ_utils import PRIORITIES, compare_issues_infinidat


def compile_cmp(source: str):
    try:
        code = compile(source, 'String', 'exec')
    except (SyntaxError, ValueError):
        return None

    def cmp(a, b):
        things = {
            'PRIORITIES': PRIORITIES,
            'issue_cmp': issue_cmp,
            'compare_issues_infinidat': compare_issues_infinidat,
        }
        vars = {'a': a, 'b': b, 'result': 0}

        try:
            exec(code, things, vars)
        except:
            sys.stderr.write('An error occurred in the comparator')
            sys.stderr.write(traceback.format_exc())

        if not vars['result']:  # tie-breaker
            return issue_cmp(a, b)
        return vars['result']

    return cmp


def issue_cmp(a, b):
    'Compare issues'

    return strcoll(a.key, b.key)


def new_dict():
    'Django cannot serialize lambdas'

    return {}


def getattr2(object, name):
    'Nested getattr'

    attr_names = name.split('.')
    for a in attr_names:
        object = getattr(object, a)
    return object


def repr_attributes(*attr_names):
    'Generate __repr__ and __str__ methods from attributes'

    def update_class(cls):
        def repr_method(this):
            pairs = [f'{a}={getattr2(this, a)}' for a in attr_names]
            return '%s(%s)' % (this.__class__.__name__, ' '.join(pairs))

        if '__repr__' not in cls.__dict__:
            cls.__repr__ = repr_method

        if '__str__' not in cls.__dict__:
            cls.__str__ = repr_method

        return cls

    return update_class


def run_if_active(method):
    'Ignore method calls based on the is_active property'

    def wrapper(self, *args, **kwargs):
        if not self.is_active:
            return
        return method(self, *args, **kwargs)

    return wrapper


TEE_TRUNCATE = 800_000
TEE_TRUNCATE_KEEP = 400_000


class Tee:
    'Write to multiple files at once. Truncate big files'

    def __init__(self, *files):
        self.files = files

    def write(self, a):
        for outfile in self.files:
            if hasattr(outfile, 'encoding'):
                outfile.write(a)
            else:
                outfile.write(bytes(a, 'utf-8'))

            if not outfile.isatty() and outfile.seekable() and outfile.tell() > TEE_TRUNCATE:
                outfile.seek(TEE_TRUNCATE_KEEP)
                saved = outfile.read()
                outfile.seek(0)
                outfile.truncate()
                outfile.write(saved)

    def __getattr__(self, name):
        return getattr(self.files[0], name)


def abstract_run(self):
    raise NotImplementedError(f'Class {self.__class__.__name__} does not implement run()')
