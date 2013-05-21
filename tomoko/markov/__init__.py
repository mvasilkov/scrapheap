from PIL import Image

def break_bits(im, n):
    return Image.eval(im, lambda c: c & 256 - 2 ** n)

class Mipmap:
    def __init__(self, im, n_levels):
        self.levels = [break_bits(im, n) for n in xrange(n_levels)]
