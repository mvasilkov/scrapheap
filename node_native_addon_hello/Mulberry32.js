/* This file is part of natlib.
 * https://github.com/mvasilkov/natlib
 */
'use strict';
/** Mulberry32 PRNG */
class Mulberry32 {
    constructor(seed) {
        this.state = seed | 0;
    }
    /** Return a pseudorandom uint32. */
    randomUint32() {
        let z = this.state = (this.state + 0x6D2B79F5) | 0;
        z = Math.imul(z ^ (z >>> 15), z | 1);
        z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
        return (z ^ (z >>> 14)) >>> 0;
    }
}

module.exports = Mulberry32
