// double DecibelsToPowerRatio(double decibels) {
//   return exp((M_LN10 / 10.0) * decibels);
// }

// MATH_DLL_INLINE f32 DecibelsToPowerRatio(f32 db) {
//   return std::powf(10.0f, db / 10.0f);
// }

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
    let power = decibelsToPowerRatio(decibels)
    let power2 = decibelsToPowerRatio2(decibels)
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
    x = decibelsToPowerRatio(decibels)
}

console.timeEnd('1')
console.log(x)

// ---

console.time('2')

for (let n = -100000; n <= 100000; ++n) {
    let decibels = 0.001 * n
    x = decibelsToPowerRatio2(decibels)
}

console.timeEnd('2')
console.log(x)
