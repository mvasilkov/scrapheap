'use strict'

function pad(n, length) {
    return `${n}`.padStart(length, '0')
}

function paddedBinaryString(n, length) {
    return pad(n.toString(2), length)
}

function ieee754(n) {
    const buf = new ArrayBuffer(8)
    const float64 = new Float64Array(buf)
    const uint32 = new Uint32Array(buf)

    float64[0] = n
    return paddedBinaryString(uint32[1], 32) + paddedBinaryString(uint32[0], 32)
}

exports.ieee754 = ieee754
