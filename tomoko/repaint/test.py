from PIL import Image
from django.core.management import call_command
from django.test import TestCase
from tempfile import NamedTemporaryFile
from tomoko.repaint import break_bits, Mipmap, Canvas, pixel_to_int, int_to_pixel
from tomoko.repaint.management.commands.repaint_load import MM_LEVEL
from tomoko.repaint.models import Point
from tomoko.repaint.reiterate import reiterate, goto_after
from tomoko.repaint.utils import progress_bar, images_equal

def _t(val, n):
    return (val, ).__mul__(n)

class BasicTest(TestCase):
    def test_break_bits(self):
        im = Image.new("RGB", (1, 1), (255, 255, 255))
        im1 = break_bits(im, 1)
        im2 = break_bits(im, 2)
        self.assertEqual(im1.getpixel((0, 0)), (254, 254, 254))
        self.assertEqual(im2.getpixel((0, 0)), (252, 252, 252))

    def _validate_mipmap(self, mm):
        self.assertEqual(mm.levels[0].getpixel((0, 0)), (127, 0, 9))
        self.assertEqual(mm.levels[2].getpixel((0, 0)), (124, 0, 8))
        self.assertEqual(mm.levels[4].getpixel((0, 0)), (112, 0, 0))
        self.assertEqual(mm.levels[8].getpixel((0, 0)), (0, 0, 0))
        self.assertEqual(tuple(mm.cons(0, 0)), _t(None, 80))

    def test_mipmap(self):
        im = Image.new("RGB", (1, 1), (127, 0, 9))
        mm = Mipmap(im, n_levels=9)
        self._validate_mipmap(mm)

    def test_canvas(self):
        canvas = Canvas(size=1, n_levels=9)
        canvas.paint(0, 0, (127, 0, 9))
        self._validate_mipmap(canvas)

    def test_canvas_future_cons(self):
        im = Image.new("RGB", (3, 3), (255, 255, 255))
        mm = Mipmap(im, n_levels=3)
        canvas = Canvas(size=3, n_levels=3)
        canvas.levels = mm.levels

        future_cons = tuple(canvas.future_cons(2, 2))
        self.assertEqual(len(future_cons), 2)
        self.assertEqual(tuple(future_cons[0]), (
            (252, 252, 252), (252, 252, 252), (252, 252, 252),
            (252, 252, 252), (254, 254, 254),
        ))
        self.assertEqual(tuple(future_cons[1]), (
            (252, 252, 252), (252, 252, 252),
        ))

    def test_int_to_pixel(self):
        self.assertEqual(int_to_pixel(0xffffff), (255, 255, 255))
        self.assertEqual(int_to_pixel(0xccff66), (204, 255, 102))

    def test_pixel_to_int(self):
        self.assertEqual(pixel_to_int((255, 255, 255)), 0xffffff)
        self.assertEqual(pixel_to_int((204, 255, 102)), 0xccff66)

    def test_from_mipmap(self):
        im = Image.new("RGB", (5, 5), (255, 255, 255))
        im.putpixel((4, 4), (204, 255, 102))
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
        self.assertEqual(point.value, 0xccff66)
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

    def test_repaint_load(self):
        self.assertEqual(Point.objects.count(), 0)

        call_command("repaint_load", "test/a.png")
        self.assertEqual(Point.objects.count(), 1)

        call_command("repaint_load", "test/b.png")
        self.assertEqual(Point.objects.count(), MM_LEVEL ** 2)

    def test_repaint_save(self):
        self.assertEqual(Point.objects.count(), 0)

        outfile = NamedTemporaryFile()
        call_command("repaint_load", "test/c.png")
        call_command("repaint_save", outfile.name, size=20)

        a = Image.open(outfile)
        b = Image.open("test/c'.png").convert("RGB")
        self.assertTrue(images_equal(a, b))

    def test_images_equal(self):
        a = Image.open("test/a.png").convert("RGB")
        b = Image.new("RGB", (1, 1), int_to_pixel(0x8efa00))
        c = Image.open("test/c.png").convert("RGB")

        self.assertTrue(images_equal(a, b))
        self.assertFalse(images_equal(a, c))
        self.assertFalse(images_equal(b, c))

        a = Image.new("RGB", (1, 1), (255, 255, 255))
        b = Image.new("RGB", (5, 5), (255, 255, 255))
        self.assertFalse(images_equal(a, b))

    def test_progress_bar(self):
        self.assertEqual(progress_bar(0, 1),
            "[                        ]")
        self.assertEqual(progress_bar(250, 500),
            "[############            ]")
        self.assertEqual(progress_bar(48, 48),
            "[########################]")

    def test_reiterate(self):
        result = tuple(reiterate(2))
        self.assertEqual(result, ((0, 0), (1, 0), (0, 1), (1, 1)))

    def test_reiterate_goto(self):
        result = tuple()
        _jmp = False
        for u, v in reiterate(2):
            result += ((u, v), )
            if u == 0 and v == 1 and not _jmp:
                _jmp = True
                goto_after(1, 0)
        self.assertEqual(result, ((0, 0), (1, 0), (0, 1), (0, 1), (1, 1)))
