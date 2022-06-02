'use strict'

function easeOutCubic(t) {
    --t
    return t * t * t + 1
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t
}

function triangleSlow(duration, startFreq, endFreq) {
    const speed = 4 * startFreq / ac.sampleRate
    const endSpeed = 4 * endFreq / ac.sampleRate
    const lengthFrames = Math.ceil(duration * ac.sampleRate)
    const fadeOutFrames = Math.ceil(0.01 * ac.sampleRate)

    const buf = ac.createBuffer(1, lengthFrames, ac.sampleRate)
    const chan = buf.getChannelData(0)

    let pos = 0
    let sign = 1

    for (let a = 0; a < lengthFrames; ++a) {
        chan[a] = pos

        if (sign == 1) {
            pos += lerp(speed, endSpeed, easeOutCubic(a / lengthFrames))
            if (pos > 1) {
                pos = 2 - pos
                sign = -1
            }
        }
        else {
            pos -= lerp(speed, endSpeed, easeOutCubic(a / lengthFrames))
            if (pos < -1) {
                pos = -2 - pos
                sign = 1
            }
        }
    }

    for (let b = 0; b < fadeOutFrames; ++b) {
        chan[lengthFrames - b - 1] *= b / fadeOutFrames
    }

    return buf
}
