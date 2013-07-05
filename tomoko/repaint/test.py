from PIL import Image
from django.test import TestCase
from tomoko.repaint.picture import Picture

def _t(a, n):
    return (a, ).__mul__(n)

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
