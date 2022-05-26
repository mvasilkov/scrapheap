GOOGLE_PATH = .

all:
	$(MAKE) --no-print-directory sync
	@echo done $@

help:
	$(MAKE) --no-print-directory help-depswriter
	$(MAKE) --no-print-directory help-closurebuilder
	$(MAKE) --no-print-directory help-closurecompiler
	@echo done $@

help-depswriter:
	$(GOOGLE_PATH)/closure-library/closure/bin/build/depswriter.py --help
	@echo done $@

help-closurebuilder:
	$(GOOGLE_PATH)/closure-library/closure/bin/build/closurebuilder.py --help
	@echo done $@

help-closurecompiler:
	-java -jar $(GOOGLE_PATH)/closure-compiler/compiler.jar --version --help
	@echo done $@

sync:
	$(MAKE) --no-print-directory sync-closure-compiler
	$(MAKE) --no-print-directory sync-closure-library
	@echo done $@

sync-closure-compiler:
	$(SYNC_CLOSURE_COMPILER_COMMAND)
	@echo done $@

SYNC_CLOSURE_COMPILER_COMMAND += mkdir -p $(GOOGLE_PATH)/closure-compiler ;
SYNC_CLOSURE_COMPILER_COMMAND += if [ -e $(GOOGLE_PATH)/closure-compiler/compiler-latest.tar.gz ] ; then
SYNC_CLOSURE_COMPILER_COMMAND +=  curl http://closure-compiler.googlecode.com/files/compiler-latest.tar.gz
SYNC_CLOSURE_COMPILER_COMMAND +=   -o $(GOOGLE_PATH)/closure-compiler/compiler-latest.tar.gz
SYNC_CLOSURE_COMPILER_COMMAND +=   -z $(GOOGLE_PATH)/closure-compiler/compiler-latest.tar.gz ;
SYNC_CLOSURE_COMPILER_COMMAND += else
SYNC_CLOSURE_COMPILER_COMMAND +=  curl http://closure-compiler.googlecode.com/files/compiler-latest.tar.gz
SYNC_CLOSURE_COMPILER_COMMAND +=   -o $(GOOGLE_PATH)/closure-compiler/compiler-latest.tar.gz ;
SYNC_CLOSURE_COMPILER_COMMAND += fi ;
SYNC_CLOSURE_COMPILER_COMMAND += tar -zxvf $(GOOGLE_PATH)/closure-compiler/compiler-latest.tar.gz -C $(GOOGLE_PATH)/closure-compiler/ ;

sync-closure-library:
	mkdir -p $(GOOGLE_PATH)/closure-library
	svn checkout http://closure-library.googlecode.com/svn/trunk/ $(GOOGLE_PATH)/closure-library
	@echo done $@

