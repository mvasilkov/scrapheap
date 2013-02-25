all:
	$(MAKE) --no-print-directory -C Box2D/Build
	jam install
	python RequireJS/build.py
	@echo done $@
