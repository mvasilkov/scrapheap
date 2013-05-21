from PIL import Image
from django.test import TestCase
from tomoko.markov import break_bits, Mipmap

class MarkovTest(TestCase):
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
