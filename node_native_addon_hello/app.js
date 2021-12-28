'use strict'
const Mulberry32 = require('./Mulberry32')
const fun = require('./build/Release/fun')

const start = 0

const r = new Mulberry32(start)

fun.seed(start)

for (let n = 0; n < 2 ** 32; ++n) {
    const a = r.randomUint32()
    const b = fun.next()
    if (a !== b) {
        console.log(`Dead! a=${a} b=${b} n=${n} state=${r.state}`)
        break
    }
    if (n % 10000000 === 0) console.log(n)
}
