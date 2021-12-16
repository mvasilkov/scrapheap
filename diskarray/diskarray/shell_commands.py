import re
import subprocess


def sha256(path):
    p = subprocess.run(
        ['rhash', '--sha256', path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
        encoding='utf-8')
    sha256sum = p.stdout[:64]
    if re.fullmatch('[0-9a-f]{64}', sha256sum) is None:
        raise RuntimeError('rhash did dieded')
    return sha256sum


def copy(a, b):
    p = subprocess.run(
        ['rsync', '-Wav', a, b],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
        encoding='utf-8')
    return p


def mount_lines():
    p = subprocess.run(
        ['mount'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
        encoding='utf-8')
    return [line for line in p.stdout.splitlines() if line.startswith('/')]
