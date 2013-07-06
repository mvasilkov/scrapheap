from math import sqrt

def cdist(c, c2):
    r, g, b = c
    r2, g2, b2 = c2
    rmean = float(r + r2) / 2
    r -= r2
    g -= g2
    b -= b2
    return sqrt(float((512 + rmean) * r ** 2) / 256 +
        (4 * g ** 2) + float((767 - rmean) * b ** 2) / 256)
