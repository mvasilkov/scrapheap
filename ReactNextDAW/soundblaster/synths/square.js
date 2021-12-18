'use strict'

import { freq, voices as _voices } from '../util'

let ac, out, voices

function start(_ac, _out) {
    console.log('Starting synth: square')

    ac = _ac
    out = _out
    voices = _voices()
}

function end() {
    console.log('Ending synth: square')

    for (const a of voices) {
        for (const b in a) {
            stopNote(a, b)
        }
    }
}

function playNote(octave, note) {
    if (voices[octave][note]) return

    const osc = voices[octave][note] = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq(octave, note)
    osc.connect(out)
    osc.start(0)
}

function stopNote(octave, note) {
    if (!voices[octave][note]) return

    const osc = voices[octave][note]
    osc.stop(0)
    osc.disconnect()

    voices[octave][note] = null
}

export default {
    title: 'square',
    start,
    end,
    playNote,
    stopNote,
}
