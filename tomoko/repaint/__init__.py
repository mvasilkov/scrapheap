from PIL import Image

def int_to_pixel(n):
    return ((n & 0xff0000) >> 16,
            (n & 0x00ff00) >> 8,
            (n & 0x0000ff))

def pixel_to_int(raw):
    return raw[0] << 16 | raw[1] << 8 | raw[2]

def break_bits(im, n):
    return Image.eval(im, lambda c: c & 256 - 2 ** n)

class Mipmap:
    def __init__(self, im, n_levels):
        self.levels = [break_bits(im, n) for n in xrange(n_levels)]
        self.n_levels = n_levels

    def cons(self, start_u, start_v):
        end = self.n_levels - 1
        start_u -= end
        start_v -= end

        for v in xrange(self.n_levels):
            for u in xrange(self.n_levels):
                if u == end and v == end:
                    return
                uu = u + start_u
                vv = v + start_v
                if uu | vv < 0:
                    yield None
                else:
                    level = max(end - u, end - v)
                    yield self.levels[level].getpixel((uu, vv))
