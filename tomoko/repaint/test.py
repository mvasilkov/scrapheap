from PIL import Image
from django.test import TestCase
from tomoko.repaint import int_to_pixel, pixel_to_int
from tomoko.repaint.models import Point
from tomoko.repaint.picture import Picture

def _t(a, n):
    return (a, ).__mul__(n)

class BasicTest(TestCase):
    def test_int_to_pixel(self):
        self.assertEqual(int_to_pixel(0xffffff), (255, 255, 255))
        self.assertEqual(int_to_pixel(0xccff66), (204, 255, 102))

        self.assertEqual(repr(int_to_pixel(0xffffffl)).find("L"), -1)

    def test_pixel_to_int(self):
        self.assertEqual(pixel_to_int((255, 255, 255)), 0xffffff)
        self.assertEqual(pixel_to_int((204, 255, 102)), 0xccff66)

class PictureTest(TestCase):
    def test_cons_at(self):
        a = None
        b = (0, 0, 0)
        im = Image.new("RGB", (9, 9), b)
        pic = Picture(im, 9)

        self.assertEqual(tuple(pic.cons_at(0, 0)), _t(a, 80))
        self.assertEqual(tuple(pic.cons_at(8, 8)), _t(b, 80))

        test = (a, a, a, a, a, a, a, a, a,
                a, a, a, a, a, a, a, a, a,
                a, a, a, a, a, a, a, a, a,
                a, a, a, a, a, a, a, a, a,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b)
        self.assertEqual(tuple(pic.cons_at(4, 4)), test)

    def _validate_point(self, p, test, val, basic):
        self.assertEqual(p.cons, repr(test))
        self.assertEqual(p.val, val)
        self.assertEqual(p.is_basic, basic)

    def test_point_at(self):
        a = None
        b = (0, 0, 0)
        im = Image.new("RGB", (9, 9), b)
        pic = Picture(im, 9)

        self._validate_point(pic.point_at(0, 0), _t(a, 80), 0, True)
        self._validate_point(pic.point_at(8, 8), _t(b, 80), 0, True)

        test = (a, a, a, a, a, a, a, a, a,
                a, a, a, a, a, a, a, a, a,
                a, a, a, a, a, a, a, a, a,
                a, a, a, a, a, a, a, a, a,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b, b,
                a, a, a, a, b, b, b, b)
        self._validate_point(pic.point_at(4, 4), test, 0, True)

class PointTest(TestCase):
    def test_loop(self):
        p = Point(cons=repr(_t(None, 3)), val=0)
        self.assertEqual(tuple(p.loop()), _t((0, 0, 0), 4))

        p = Point(cons=repr(_t((255, 255, 255), 3)), val=0xffffff)
        self.assertEqual(tuple(p.loop()), _t((255, 255, 255), 4))
