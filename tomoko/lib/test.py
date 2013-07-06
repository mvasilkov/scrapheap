from PIL import Image
from django.test import TestCase
from tomoko.lib.cdist import cdist
from tomoko.lib.equal import equal

class ColourDistanceTest(TestCase):
    def test_cdist(self):
        a = b = (0, 0, 0)
        self.assertEqual(cdist(a, b), 0)

        a = (255, 0, 0)
        b = (255, 0, 128)
        c = (255, 0, 255)
        self.assertTrue(cdist(a, b) > cdist(b, c))
        self.assertEqual(cdist(a, b), cdist(b, a))

class EqualTest(TestCase):
    def test_equal(self):
        a = Image.open('test/a.png').convert('RGB')
        b = Image.new('RGB', (1, 1), (255, 255, 255))
        self.assertTrue(equal(a, b))

        a = Image.new('RGB', (1, 1), (0, 0, 0))
        b = Image.new('RGB', (9, 9), (0, 0, 0))
        self.assertFalse(equal(a, b))
