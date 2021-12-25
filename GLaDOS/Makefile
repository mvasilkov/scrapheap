python_version := 3.6

.PHONY: test
test:
	virtual/bin/pytest --verbose

virtual: requirements.txt
	python$(python_version) -m venv virtual
	virtual/bin/pip install -r requirements.txt
