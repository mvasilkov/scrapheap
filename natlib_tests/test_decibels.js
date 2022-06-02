// double DecibelsToPowerRatio(double decibels) {
//   return exp((M_LN10 / 10.0) * decibels);
// }

// MATH_DLL_INLINE f32 DecibelsToPowerRatio(f32 db) {
//   return std::powf(10.0f, db / 10.0f);
// }


/* This file is part of natlib.
 * https://github.com/mvasilkov/natlib
 * MIT License | Copyright (c) 2022 Mark Vasilkov
 */
'use strict'
/** Convert decibels to power ratio. */
function convertDecibelsToPowerRatio(decibels) {
    return 10 ** (decibels / 10)
}
/** Convert decibels to amplitude ratio. */
function convertDecibelsToAmplitudeRatio(decibels) {
    return 10 ** (decibels / 20)
}
/** Convert power ratio to decibels. */
function convertPowerRatioToDecibels(linear) {
    return 10 * Math.log10(linear)
}
/** Convert amplitude ratio to decibels. */
function convertAmplitudeRatioToDecibels(linear) {
    return 20 * Math.log10(linear)
}
/** Fast decibels to power ratio. */
function convertDecibelsToPowerRatioFast(decibels) {
    return Math.exp(Math.LN10 / 10 * decibels)
}
/** Fast decibels to amplitude ratio. */
function convertDecibelsToAmplitudeRatioFast(decibels) {
    return Math.exp(Math.LN10 / 20 * decibels)
}


// 3x faster
function decibelsToPowerRatio(decibels) {
    return Math.exp((Math.LN10 / 10) * decibels)
}

// Better precision
function decibelsToPowerRatio2(decibels) {
    return 10 ** (decibels / 10)
}

let equal = 0
let notEqual = 0
let errors = []

for (let n = -100000; n <= 100000; ++n) {
    let decibels = 0.001 * n
    let power = convertDecibelsToPowerRatioFast(decibels)
    let power2 = convertDecibelsToPowerRatio(decibels)
    if (power != power2) {
        console.log(`${decibels} dB ${power} ${power2}`)
        ++notEqual
        errors.push(Math.abs(power2 - power))
    }
    else ++equal
}

errors.sort((a, b) => b - a)

console.log(`${equal} equal, ${notEqual} not equal`)
console.log(`average error: ${errors.reduce((a, b) => a + b, 0) / errors.length}`)
console.log(`largest error: ${errors[0]}`)

console.log(`Perf:`)

let x = 0

// ---

console.time('1')

for (let n = -100000; n <= 100000; ++n) {
    let decibels = 0.001 * n
    x = convertDecibelsToPowerRatioFast(decibels)
}

console.timeEnd('1')
console.log(x)

// ---

console.time('2')

for (let n = -100000; n <= 100000; ++n) {
    let decibels = 0.001 * n
    x = convertDecibelsToPowerRatio(decibels)
}

console.timeEnd('2')
console.log(x)
