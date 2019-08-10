const chiSquaredTest = require('chi-squared-test')

const { ieee754 } = require('./ieee754')

function randomInclusive() {
    return Math.floor(Math.random() * 0x20000000000000) / 0x1fffffffffffff
}

const COUNT = 100000
const OFFSET_BIT = 12
const EXPECT = ieee754(0).split('').slice(OFFSET_BIT).map(_ => 0.5 * COUNT)

function bitCount(gen) {
    const bits = ieee754(0).split('').slice(OFFSET_BIT).map(_ => 0)
    for (let a = 0; a < COUNT; ++a) {
        const vec = ieee754(gen()).split('').slice(OFFSET_BIT)
        for (let b = 0; b < bits.length; ++b) {
            if (vec[b] == '1')
                ++bits[b]
        }
    }
    return bits
}

let count = bitCount(_ => Math.random())
console.log('44 bits from Math.random',
    chiSquaredTest(count.slice(0, 44), EXPECT.slice(0, 44), 1).probability)

count = bitCount(_ => randomInclusive())
console.log('44 bits from randomInclusive',
    chiSquaredTest(count.slice(0, 44), EXPECT.slice(0, 44), 1).probability)
