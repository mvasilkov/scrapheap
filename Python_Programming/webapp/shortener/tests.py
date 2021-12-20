from django.test import SimpleTestCase
from shortener.views import encode, decode

class EncodeDecodeTest(SimpleTestCase):
    def test_encode(self):
        self.assertIs(encode(-1), None)
        self.assertEqual(encode(0), 'B')
        self.assertEqual(encode(51), 'CB')
        self.assertEqual(encode(51 ** 2), 'CBB')
        self.assertEqual(encode(51 ** 3), 'CBBB')

    def test_decode(self):
        self.assertIs(decode('bad input'), None)
        self.assertEqual(decode('B'), 0)
        self.assertEqual(decode('CB'), 51)
        self.assertEqual(decode('CBB'), 51 ** 2)
        self.assertEqual(decode('CBBB'), 51 ** 3)


from django.test import TestCase, Client
from shortener.models import TargetUrl

class UrlSubmitTest(TestCase):
    def test_url_submission(self):
        # in the beginning, the database should be empty
        self.assertEqual(TargetUrl.objects.count(), 0)

        # submitting the form redirects to the success page
        client = Client()
        response = client.post('/', {'url': 'http://example.com/'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, '/success/' + encode(1))

        # ensure that the submitted URL is stored in the database
        target_url = TargetUrl.objects.get(id=1)
        self.assertEqual(target_url.url, 'http://example.com/')
