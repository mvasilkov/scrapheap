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
        pass
