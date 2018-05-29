from locale import strcoll

PRIORITIES = {
    'Blocker': 1,
    'Critical': 2,
    'Major': 3,
    'Minor': 4,
    'Trivial': 5,
}


def compile_cmp(source: str):
    try:
        code = compile(source, 'String', 'exec')
    except (SyntaxError, ValueError):
        return None

    def cmp(a, b):
        vars = {'a': a, 'b': b, 'result': 0}
        exec(code, {'PRIORITIES': PRIORITIES}, vars)
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
