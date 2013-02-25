code = open("Box2D/Build/Box2D/box2d-html5.js").read()
wrapper = open("RequireJS/wrapper.js").read()

out = open("RequireJS/Build/box2d-html5.js", "w")
out.write(wrapper % code.strip())
out.close()
