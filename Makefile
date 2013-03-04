all:
	$(MAKE) --no-print-directory -C Box2D/Build
	ln -f Box2D/Build/Box2D/box2d-html5.js RequireJS/box2d-html5.build.js
	$(MAKE) --no-print-directory -C RequireJS
	@echo done $@

clean:
	git clean -dfx
