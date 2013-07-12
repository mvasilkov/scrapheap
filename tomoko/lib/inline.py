from PIL import Image
from cStringIO import StringIO

def inline(image, size):
    tmp = Image.new('RGB', (size, size), None)
    buf = tmp.load()
    for v in xrange(size):
        for u in xrange(size):
            buf[u, v] = next(image)

    out = StringIO()
    tmp.save(out, 'PNG')
    result = out.getvalue().encode('base64')
    out.close()

    return result
