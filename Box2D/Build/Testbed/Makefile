GOOGLE_PATH = ../google
BOX2D_HTML5_PATH = ../../..

SOURCE_FILES += main.js

SOURCE_PATHS += $(BOX2D_HTML5_PATH)/Box2D/Testbed
SOURCE_PATHS += $(BOX2D_HTML5_PATH)/Contributions
SOURCE_PATHS += $(BOX2D_HTML5_PATH)/Box2D/Box2D
SOURCE_PATHS += $(GOOGLE_PATH)/closure-library/third_party/closure/goog
SOURCE_PATHS += $(GOOGLE_PATH)/closure-library/closure/goog

OUTPUT_NAMESPACE = "main.start"
OUTPUT_FILE = box2d-html5-testbed.js

all:
	$(MAKE) --no-print-directory deps
	$(MAKE) --no-print-directory build
	$(MAKE) --no-print-directory run

help:
	@echo done $@

sync:
	$(MAKE) --no-print-directory -C $(GOOGLE_PATH) sync
	@echo done $@

deps:
	$(DEPS_COMMAND)
	@echo done $@

# depswriter needs the relative path from base.js in
# $(GOOGLE_PATH)/closure-library/closure/goog
# to this makefile directory
DEPSWRITER_PREFIX = ../../../../Testbed

DEPS_COMMAND += $(GOOGLE_PATH)/closure-library/closure/bin/build/depswriter.py
DEPS_COMMAND += $(foreach file,$(SOURCE_FILES),--path_with_depspath="$(file) $(DEPSWRITER_PREFIX)/$(file)")
DEPS_COMMAND += $(foreach path,$(SOURCE_PATHS),--root_with_prefix="$(path) $(DEPSWRITER_PREFIX)/$(path)")
DEPS_COMMAND += > deps.js

clean:
	rm -fv $(OUTPUT_FILE)
	@echo done $@

build:
	$(BUILD_COMMAND)
	@echo done $@

BUILD_COMMAND += $(GOOGLE_PATH)/closure-library/closure/bin/build/closurebuilder.py
BUILD_COMMAND += --namespace=$(OUTPUT_NAMESPACE)
BUILD_COMMAND += $(SOURCE_FILES)
BUILD_COMMAND += $(patsubst %,--root=%,$(SOURCE_PATHS))
BUILD_COMMAND += --output_mode=compiled
BUILD_COMMAND += --compiler_jar=$(GOOGLE_PATH)/closure-compiler/compiler.jar
BUILD_COMMAND += $(COMPILER_FLAGS)
BUILD_COMMAND += --output_file=$(OUTPUT_FILE)

COMPILER_FLAGS += --compiler_flags="--generate_exports"

#COMPILER_FLAGS += --compiler_flags="--compilation_level=WHITESPACE_ONLY"
COMPILER_FLAGS += --compiler_flags="--compilation_level=SIMPLE_OPTIMIZATIONS"
#COMPILER_FLAGS += --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS"

COMPILER_FLAGS += --compiler_flags="--define=goog.DEBUG=false"
COMPILER_FLAGS += --compiler_flags="--define=box2d.DEBUG=false"

COMPILER_FLAGS += --compiler_flags="--jscomp_error=accessControls"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=ambiguousFunctionDecl"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=checkRegExp"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=checkTypes"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=checkVars"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=constantProperty"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=deprecated"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=es5Strict"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=externsValidation"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=fileoverviewTags"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=globalThis"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=internetExplorerChecks"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=invalidCasts"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=missingProperties"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=nonStandardJsDocs"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=strictModuleDepCheck"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=typeInvalidation"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=undefinedVars"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=unknownDefines"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=uselessCode"
COMPILER_FLAGS += --compiler_flags="--jscomp_error=visibility"

run:
	if [[ "$${OSTYPE}" == "cygwin" ]]; then cygstart index.html; fi
	if [[ "$${OSTYPE}" == "darwin"* ]]; then open index.html; fi
	@echo done $@

debug:
	if [[ "$${OSTYPE}" == "cygwin" ]]; then cygstart index-debug.html; fi
	if [[ "$${OSTYPE}" == "darwin"* ]]; then open index-debug.html; fi
	@echo done $@

