all:
	$(MAKE) --no-print-directory deps
	$(MAKE) --no-print-directory build
	$(MAKE) --no-print-directory run

deps:
	jam install
	@echo done $@

build:
	python build.py
	@echo done $@

run:
	if [[ "$${OSTYPE}" == "cygwin" ]]; then cygstart Build/index.html; fi
	if [[ "$${OSTYPE}" == "darwin"* ]]; then open Build/index.html; fi
	@echo done $@

.PHONY: all deps build run
