#!/usr/bin/env python
import sys

from defaults import setenv

if __name__ == '__main__':
    setenv()

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
