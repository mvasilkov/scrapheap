from magenta.music import constants
from magenta.music.musicxml_parser import Tempo
from magenta.music.musicxml_reader import musicxml_file_to_sequence_proto


def _parse(self):
    self.qpm = constants.DEFAULT_QUARTERS_PER_MINUTE
    self.time_position = self.state.time_position


Tempo._parse = _parse

TEMPO_MUL = 120 / 115

track = musicxml_file_to_sequence_proto('a.xml')

out = open('out.js', 'w', encoding='utf-8')
print('function play() {', file=out)

for a in track.notes:
    call = (
        f'    playNote({a.pitch}, {a.start_time}, {a.end_time})'
    )  # {a.numerator}/{a.denominator}
    print(call, file=out)

print('}', file=out)
