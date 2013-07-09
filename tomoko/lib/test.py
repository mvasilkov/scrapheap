from PIL import Image
from cdist import cdist
from django.test import TestCase
from tomoko.lib.equal import equal
from tomoko.lib.mat import mat_rows, mat_cols

def range_t(*args):
    return tuple(range(*args))

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

class MatTest(TestCase):
    def test_mat_rows(self):
        n = 5
        s = range(n ** 2)
        result = mat_rows(s, n)
        test = [range_t(n * 0, n * 1),
                range_t(n * 1, n * 2),
                range_t(n * 2, n * 3),
                range_t(n * 3, n * 4),
                range_t(n * 4, n * 5)]
        self.assertEqual(result, test)

    def test_mat_cols(self):
        n = 5
        s = range(n ** 2)
        result = mat_cols(s, n)
        test = [range_t(0, n ** 2, n),
                range_t(1, n ** 2, n),
                range_t(2, n ** 2, n),
                range_t(3, n ** 2, n),
                range_t(4, n ** 2, n)]
        self.assertEqual(result, test)
