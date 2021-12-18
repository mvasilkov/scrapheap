'use strict'

import { note as _note } from '@tonaljs/tonal'

function octave() {
    return {
        'C': null,
        'C#': null,
        'D': null,
        'D#': null,
        'E': null,
        'F': null,
        'F#': null,
        'G': null,
        'G#': null,
        'A': null,
        'A#': null,
        'B': null,
    }
}

export const voices = _ => [octave(), octave(), octave(), octave()]

export const freq = (octave, note) => _note(`${note}${octave + 4}`).freq
