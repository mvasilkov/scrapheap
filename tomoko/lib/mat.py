def mat_rows(s, n):
    return zip(*(iter(s), ) * n)

def mat_cols(s, n):
    return zip(*(iter(s[n * k:]) for k in xrange(n)))
