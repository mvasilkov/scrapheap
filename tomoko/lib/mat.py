def mat_rows(s, n):
    return zip(*(iter(s), ) * n)


def mat_cols(s, n):
    return zip(*(iter(s[n * k:]) for k in xrange(n)))


def mat_null(fn, s, n):
    return len(filter(lambda a: a == (None, ) * n, fn(s, n)))
