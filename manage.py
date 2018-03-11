#!/usr/bin/env python3.6
import sys

from defaults import setenv

if __name__ == '__main__':
    setenv()

    try:
        from django.core.management import execute_from_command_line
    except ImportError as err:
        raise ImportError('Cannot import Django') from err

    execute_from_command_line(sys.argv)
