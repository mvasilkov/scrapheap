from PIL import ImageChops

def equal(a, b):
    if a.size != b.size:
        return False
    return ImageChops.difference(a, b).getbbox() is None
