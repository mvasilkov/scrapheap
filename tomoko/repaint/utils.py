from PIL import Image, ImageChops
from cStringIO import StringIO

def inline_image(image, size):
    im = Image.new("RGB", (size, size), None)
    pic = im.load()
    for v in xrange(size):
        for u in xrange(size):
            pic[u, v] = next(image) or (0, 0, 0)

    out = StringIO()
    im.save(out, "PNG")
    result = out.getvalue().encode("base64")
    out.close()

    return result

def progress_bar(val, end):
    progress = "#" * (24 * val // end)
    return "[%-24s] %9d" % (progress, val)

def images_equal(a, b):
    return ImageChops.difference(a, b).getbbox() is None
