compiler_out = "Box2D/Build/Box2D/box2d-html5.js"
requirejs_tmp = "RequireJS/box2d-html5.build.js"

all:
	$(MAKE) --no-print-directory -C Box2D/Build
	# RequireJS
	ln -f $(compiler_out) $(requirejs_tmp)
	$(MAKE) --no-print-directory -C RequireJS
	rm -f $(requirejs_tmp)
	@echo done $@

clean:
	git clean -dfx
