#!/usr/bin/env python3

from os import chmod

script = '''#!/usr/bin/env node
'use strict'
{{thing}}
const { heapUsed } = process.memoryUsage()
console.log((heapUsed * 1e-6).toFixed(2) + ' MB')
'''

a = ['const obj = {']
for n in range(100_000):
    a.append(f"\ta{n:05d}: 'This is a constant number {n:05d}, look at me!',")
a.append('}')

b = ['const obj = {']
for n in range(100_000):
    b.append(f"\ta{n:05d}: 'This is a constant useless shit, look at me!',")
b.append('}')

c = [f"const thing = 'This is a constant useless shit, look at me!'", 'const obj = {']
for n in range(100_000):
    c.append(f"\ta{n:05d}: thing,")
c.append('}')

with open('strings.js', 'w', encoding='utf-8') as out:
    print(script.replace('{{thing}}', '\n'.join(a)), end='', file=out)

with open('strings2.js', 'w', encoding='utf-8') as out:
    print(script.replace('{{thing}}', '\n'.join(b)), end='', file=out)

with open('strings3.js', 'w', encoding='utf-8') as out:
    print(script.replace('{{thing}}', '\n'.join(c)), end='', file=out)

chmod('strings.js', 0o755)
chmod('strings2.js', 0o755)
chmod('strings3.js', 0o755)
