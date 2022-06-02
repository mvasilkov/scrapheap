#!/usr/bin/env python3

import aifc
import numpy as np


def run(filename):
    a = aifc.open(filename, 'rb')
    props = a.getparams()

    assert 1 <= props.nchannels <= 2

    bits = props.sampwidth * 8
    channels = 'Mono' if props.nchannels == 1 else 'Stereo'
    print(f'Input: {bits}-bit {props.framerate} {channels}')
    if bits != 16 or channels != 'Stereo':
        print('Unsupported')
        return -1

    print('Count:', props.nframes)
    wav = a.readframes(props.nframes)
    if a.readframes(1):
        print('Bad count')
        return -1

    b = np.frombuffer(wav, dtype=np.uint32)
    assert len(b) == props.nframes
    b = np.trim_zeros(b)
    print('Count (1):', len(b))

    out = aifc.open('out.aiff', 'wb')
    out.setparams(props)
    out.setnframes(len(b))
    out.writeframes(b.tobytes())
    out.close()

    return 0


if __name__ == '__main__':
    import sys

    if len(sys.argv) != 2:
        print(f'Usage: {sys.argv[0]} track.aiff')
        sys.exit(1)

    sys.exit(run(sys.argv[1]))
