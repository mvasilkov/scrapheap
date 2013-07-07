from cdist import cdist

def cons_dist(a, b):
    assert len(a) == len(b)
    return sum(cdist(*args) for args in zip(a, b))
