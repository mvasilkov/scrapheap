code = open("box2d-html5.build.js").read()
wrapper = open("wrapper.js").read()

out = open("Build/box2d-html5.js", "w")
out.write(wrapper % code.strip())
out.close()
