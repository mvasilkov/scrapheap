from functools import cmp_to_key
from math import floor

from magenta.music import constants
from magenta.music.musicxml_parser import Tempo
from magenta.music.musicxml_reader import musicxml_file_to_sequence_proto


def _parse(self):
    self.qpm = constants.DEFAULT_QUARTERS_PER_MINUTE
    self.time_position = self.state.time_position


Tempo._parse = _parse

TEMPO_MUL = 120 / 115

track = musicxml_file_to_sequence_proto('a.xml')


@cmp_to_key
def compare_notes(a, b):
    if a.start_time == b.start_time:
        return b.pitch - a.pitch
    return a.start_time - b.start_time


out = open('out.js', 'w', encoding='utf-8')
print('function play(n) {', file=out)
print('    switch(n) {', file=out)

# for a in track.notes:
#     call = (
#         f'    playNote({a.pitch}, {a.start_time}, {a.end_time})'
#     )  # {a.numerator}/{a.denominator}
#     print(call, file=out)

bars = {}

for a in track.notes:
    n = floor(a.start_time)
    if n in bars:
        bars[n].append(a)
    else:
        bars[n] = [a]

for n in sorted(bars.keys()):
    print(f'    case {n}: // bar {n + 1}', file=out)
    for a in sorted(bars[n], key=compare_notes):
        call = (
            f'        playNote({a.pitch}, n + {a.start_time - n}, n + {a.end_time - n})'
        )  # {a.numerator}/{a.denominator}
        print(call, file=out)
    print('        break', file=out)

print('    }', file=out)
print('}', file=out)
