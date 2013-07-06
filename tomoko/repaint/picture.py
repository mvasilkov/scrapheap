from PIL import Image
from tomoko.repaint import int_to_pixel, pixel_to_int
from tomoko.repaint.models import Point

class Picture:
    def __init__(self, im, level):
        self.im = im if im.mode == "RGB" else im.convert("RGB")
        self.level = level

    def cons_at(self, u, v):
        for rv in reversed(xrange(v, v - self.level, -1)):
            for ru in reversed(xrange(u, u - self.level, -1)):
                if u == ru and v == rv:
                    return
                yield None if ru < 0 or rv < 0 else self.im.getpixel((ru, rv))

    def point_at(self, u, v):
        cons = repr(tuple(self.cons_at(u, v)))
        val = pixel_to_int(self.im.getpixel((u, v)))
        p, _ = Point.objects.get_or_create(cons=cons, val=val, is_basic=True)
        return p

class Canvas(Picture):
    def __init__(self, size, level):
        self.im = Image.new('RGB', (size, size), (0, 0, 0))
        self.level = level

    def paint(self, u, v, val):
        self.im.putpixel((u, v), int_to_pixel(val))

    def save(self, filename):
        self.im.save(filename, 'PNG')
