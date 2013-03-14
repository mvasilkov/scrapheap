import re

exportSymbol = re.escape('goog.exportSymbol("box2d.')
end = re.escape(');')

code = open('box2d-html5.build.js').read()
wrapper = open('wrapper.js').read()

code = re.sub(exportSymbol + '.+?' + end, '', code)

out = open('Build/box2d-html5.js', 'w')
out.write(wrapper % code.strip())
out.close()
