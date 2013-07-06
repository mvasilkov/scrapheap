from PIL import Image
from django.test import TestCase
from tomoko.lib.equal import equal

class EqualTest(TestCase):
    def test_equal(self):
        a = Image.open('test/a.png').convert('RGB')
        b = Image.new('RGB', (1, 1), (255, 255, 255))
        self.assertTrue(equal(a, b))

        a = Image.new('RGB', (1, 1), (0, 0, 0))
        b = Image.new('RGB', (9, 9), (0, 0, 0))
        self.assertFalse(equal(a, b))
