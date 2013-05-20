from PIL import Image

def break_bits(im, n):
    return Image.eval(im, lambda c: c & 256 - 2 ** n)
