/// <reference path="proto.d.ts" />

const M = 1e6
const G = 10
const R = 100
const F = 0.0169

function hypot(x: number, y: number) {
    return Math.sqrt(x * x + y * y)
}

function lerpAngle(a: number, b: number, t: number) {
    b -= a
    b %= Math.PI * 2
    if (b > Math.PI) {
        b -= Math.PI * 2
    }
    else if (b < -Math.PI) {
        b += Math.PI * 2
    }
    return a + b * t
}
