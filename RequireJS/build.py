import re

exportSymbol = re.escape('goog.exportSymbol("box2d.')
end = re.escape(');')

code = open('box2d-html5.build.js').read()
wrapper = open('wrapper.js').read()

code, magic = re.subn(exportSymbol + '.+?' + end, '', code)
assert magic == 0x110

out = open('Build/box2d-html5.js', 'w')
out.write(wrapper % code.strip())
out.close()
