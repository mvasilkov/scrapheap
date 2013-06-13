from PIL import Image
from django.core.management import call_command
from django.test import TestCase
from tomoko.repaint import break_bits, Mipmap, pixel_to_int, int_to_pixel
from tomoko.repaint.management.commands.load_pic import MM_LEVEL
from tomoko.repaint.models import Point
from tomoko.repaint.utils import progress_bar

def _t(val, n):
    return (val, ).__mul__(n)

class BasicTest(TestCase):
    def test_break_bits(self):
        im = Image.new("RGB", (1, 1), (255, 255, 255))
        im1 = break_bits(im, 1)
        im2 = break_bits(im, 2)
        self.assertEqual(im1.getpixel((0, 0)), (254, 254, 254))
        self.assertEqual(im2.getpixel((0, 0)), (252, 252, 252))

    def test_mipmap(self):
        im = Image.new("RGB", (1, 1), (127, 0, 9))
        mm = Mipmap(im, n_levels=4)
        self.assertEqual(mm.levels[0].getpixel((0, 0)), (127, 0, 9))
        self.assertEqual(mm.levels[2].getpixel((0, 0)), (124, 0, 8))

    def test_int_to_pixel(self):
        self.assertEqual(int_to_pixel(0xffffff), (255, 255, 255))
        self.assertEqual(int_to_pixel(0xccff66), (204, 255, 102))

    def test_pixel_to_int(self):
        self.assertEqual(pixel_to_int((255, 255, 255)), 0xffffff)
        self.assertEqual(pixel_to_int((204, 255, 102)), 0xccff66)

    def test_from_mipmap(self):
        im = Image.new("RGB", (5, 5), (255, 255, 255))
        mm = Mipmap(im, n_levels=5)

        point = Point.from_mipmap(mm, 0, 0)
        expected = _t(None, 24)
        self.assertEqual(point.value, 0xffffff)
        self.assertEqual(point.cons, repr(expected))

        point = Point.from_mipmap(mm, 4, 4)
        b1 = _t(254, 3)
        b2 = _t(252, 3)
        b3 = _t(248, 3)
        b4 = _t(240, 3)
        expected = (b4, b4, b4, b4, b4,
                    b4, b3, b3, b3, b3,
                    b4, b3, b2, b2, b2,
                    b4, b3, b2, b1, b1,
                    b4, b3, b2, b1)
        self.assertEqual(point.value, 0xffffff)
        self.assertEqual(point.cons, repr(expected))

        point = Point.from_mipmap(mm, 2, 3)
        bx = None
        expected = (bx, bx, bx, bx, bx,
                    bx, bx, b3, b3, b3,
                    bx, bx, b2, b2, b2,
                    bx, bx, b2, b1, b1,
                    bx, bx, b2, b1)
        self.assertEqual(point.value, 0xffffff)
        self.assertEqual(point.cons, repr(expected))

    def test_load_pic(self):
        self.assertEqual(Point.objects.count(), 0)

        call_command("load_pic", "test/a.png")
        self.assertEqual(Point.objects.count(), 1)

        call_command("load_pic", "test/b.png")
        self.assertEqual(Point.objects.count(), MM_LEVEL ** 2)

    def test_progress_bar(self):
        self.assertEqual(progress_bar(0, 1),
            "[                        ]         0")
        self.assertEqual(progress_bar(250, 500),
            "[############            ]       250")
        self.assertEqual(progress_bar(48, 48),
            "[########################]        48")
