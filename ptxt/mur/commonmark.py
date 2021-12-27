from collections import namedtuple
from ctypes import CDLL, c_char_p, c_size_t, c_int
from pathlib import WindowsPath
import platform


def _libcmark():
    system = platform.system()

    if system == 'Darwin':
        return 'libcmark.dylib'

    if system == 'Windows':
        binary_dependencies = WindowsPath(__file__).parents[1] / 'binary_dependencies'
        return str(binary_dependencies / 'cmark.dll')

    return 'libcmark.so'


cmark = CDLL(_libcmark())

cmark_markdown_to_html = cmark.cmark_markdown_to_html
cmark_markdown_to_html.argtypes = (c_char_p, c_size_t, c_int)
cmark_markdown_to_html.restype = c_char_p

cmark_version = cmark.cmark_version
cmark_version.restype = c_int

Version = namedtuple('Version', 'major minor patchlevel')


def commonmark(string):
    b = string.encode('utf-8')
    return cmark_markdown_to_html(b, len(b), 0).decode('utf-8')


def version():
    return Version(*cmark_version().to_bytes(3, byteorder='big'))
