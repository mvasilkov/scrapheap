/// <reference path="proto.d.ts" />

class Starship {
    x: number
    y: number
    u: number
    v: number
    a: number
    f: number
    xPrev: number
    yPrev: number
    aPrev: number

    constructor() {
        this.x = this.xPrev = 0
        this.y = this.yPrev = -R
        this.u = 0
        this.v = 0
        this.a = this.aPrev = Math.PI * -0.5
        this.f = 0
    }

    thrust() {
        this.u += this.f * F * Math.cos(this.a)
        this.v += this.f * F * Math.sin(this.a)
    }

    paint(c: CanvasRenderingContext2D, t: number) {
        c.save()

        c.translate(lerp(this.xPrev, this.x, t), lerp(this.yPrev, this.y, t))
        c.rotate(lerpAngle(this.aPrev, this.a, t))
        c.translate(-20, -20)

        c.beginPath()
        c.rect(0, 0, 40, 40)
        c.moveTo(0, 0)
        c.lineTo(40, 20)
        c.lineTo(0, 40)
        c.lineWidth = 2
        c.strokeStyle = '#EEFF41'
        c.stroke()

        c.restore()
    }
}
