def int_to_pixel(n):
    return (int(n & 0xff0000) >> 16,
            int(n & 0x00ff00) >> 8,
            int(n & 0x0000ff))

def pixel_to_int(p):
    return p[0] << 16 | p[1] << 8 | p[2]
