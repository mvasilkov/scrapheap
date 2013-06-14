def reiterate(end):
    global XXX_u, XXX_v
    XXX_u = XXX_v = 0
    while XXX_v < end:
        while XXX_u < end:
            yield XXX_u, XXX_v
            XXX_u += 1
        XXX_u = 0
        XXX_v += 1

def goto_after(*args):
    global XXX_u, XXX_v
    XXX_u, XXX_v = args
