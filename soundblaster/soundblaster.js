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

let ac
let gain
const voices = [octave(), octave(), octave(), octave()]

function init() {
    ac = new AudioContext

    gain = ac.createGain()
    gain.gain.value = 0.2
    gain.connect(ac.destination)
}

export function playNote(octave, note) {
    if (voices[octave][note]) return

    const osc = voices[octave][note] = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = _note(`${note}${octave + 4}`).freq
    osc.connect(gain)
    osc.start(0)
}

export function stopNote(octave, note) {
    if (!voices[octave][note]) return

    const osc = voices[octave][note]
    osc.stop(0)
    osc.disconnect()

    voices[octave][note] = null
}

if (typeof window == 'object' && window.window === window) init()
