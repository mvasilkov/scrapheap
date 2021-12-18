'use strict'

import square from './synths/square'

export const synths = [
    square,
]

let ac
let gain
let synth

function init() {
    ac = new AudioContext

    gain = ac.createGain()
    gain.gain.value = 0.2
    gain.connect(ac.destination)

    synth = synths[0]
    synth.start(ac, gain)
}

export function playNote(octave, note) {
    synth.playNote(octave, note)
}

export function stopNote(octave, note) {
    synth.stopNote(octave, note)
}

export function changeSynth(title) {
    const newSynth = synths.find(a => a.title == title)
    if (newSynth && newSynth != synth) {
        synth.end()
        synth = newSynth
        synth.start(ac, gain)
    }
}

if (typeof window == 'object' && window.window === window) init()
