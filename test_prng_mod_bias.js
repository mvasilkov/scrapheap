/** Mulberry32 PRNG class */
class Mulberry32 {
    constructor(seed) {
        this.state = seed | 0;
    }
    /** Return a pseudorandom uint32. */
    randomUint32() {
        let z = this.state = (this.state + 0x6D2B79F5) | 0;
        z = Math.imul(z ^ (z >>> 15), z | 1);
        z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
        return ((z ^ (z >>> 14)) >>> 0) & 0xff;
    }
    /** Return a pseudorandom number in the range [0, 1). */
    random() {
        return this.randomUint32() / (2 ** 32);
    }
}
const UINT32_MAX = 255 // 2 ** 32 - 1;
function randomUint32LessThan(r, n) {
    const discard = UINT32_MAX - (UINT32_MAX % n);
    while (true) {
        const a = r.randomUint32();
        if (a < discard)
            return a % n;
        // else console.log('discard!', a, discard)
    }
}

function biasedLessThan(r, n) {
    return r.randomUint32() % n
}

const size = 129
const seed = 1111
const rng = new Mulberry32(seed)
const rng2 = new Mulberry32(seed)
const results = Array(size)
results.fill(0)
const results2 = Array(size)
results2.fill(0)

for (let n = 0; n < 1e8; ++n) {
    ++results[biasedLessThan(rng, size)]
    ++results2[randomUint32LessThan(rng2, size)]
}

console.log('' + results)
console.log('---')
console.log('' + results2)

console.log(''+results == ''+results2)
