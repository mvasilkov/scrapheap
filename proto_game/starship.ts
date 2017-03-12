/// <reference path="proto.d.ts" />

class Starship {
    x: number
    y: number
    u: number
    v: number
    a: number
    xPrev: number
    yPrev: number
    aPrev: number

    constructor() {
        this.x = this.xPrev = 0
        this.y = this.yPrev = -R
        this.u = 0
        this.v = 0
        this.a = this.aPrev = Math.PI * -0.5
    }
}
