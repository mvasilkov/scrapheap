from locale import strcoll

PRIORITIES = {
    'Blocker': 1,
    'Critical': 2,
    'Major': 3,
    'Minor': 4,
    'Trivial': 5,
}


# https://docs.python.org/3/howto/sorting.html
def cmp_to_key(cmp):
    'Convert a cmp= function into a key= function'

    class K:
        def __init__(self, obj, *args):
            self.obj = obj

        def __lt__(self, other):
            return cmp(self.obj, other.obj) < 0

        def __gt__(self, other):
            return cmp(self.obj, other.obj) > 0

        def __eq__(self, other):
            return cmp(self.obj, other.obj) == 0

        def __le__(self, other):
            return cmp(self.obj, other.obj) <= 0

        def __ge__(self, other):
            return cmp(self.obj, other.obj) >= 0

        def __ne__(self, other):
            return cmp(self.obj, other.obj) != 0

    return K


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
