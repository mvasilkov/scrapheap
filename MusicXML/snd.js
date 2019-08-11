'use strict'

const TEMPO_MUL = 120 / 115

function noteFreq(n) {
    return 440 * Math.pow(2, (n - 69) / 12)
}

let ac
let out

function playNote(n, start, end) {
    const freq = noteFreq(n)
    start *= TEMPO_MUL
    end *= TEMPO_MUL

    const osc = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq
    osc.connect(out)
    osc.start(ac.currentTime + start)
    osc.stop(ac.currentTime + end)
}

function init() {
    ac = new AudioContext

    out = ac.createGain()
    out.gain.value = 0.2
    out.connect(ac.destination)
}
