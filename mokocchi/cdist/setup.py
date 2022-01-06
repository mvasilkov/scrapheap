from distutils.core import setup, Extension

module = Extension('cdist', sources=['cdist/cdistmodule.c'])

setup(name='cdist', version='0.1', description='Colour distance function.',
      ext_modules=[module])
