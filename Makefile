all:
	$(MAKE) --no-print-directory -C Box2D/Build
	python RequireJS/build.py
	@echo done $@
