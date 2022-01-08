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

    update(t: number) {
        this.xPrev = this.x
        this.yPrev = this.y
        this.aPrev = this.a

        let d = hypot(this.x, this.y)

        this.f = G * M / (d * d)

        this.u -= this.x / d * this.f * t
        this.v -= this.y / d * this.f * t

        let a = Math.atan2(this.y, this.x)

        if (d < K) {
            this.a = a + Math.PI * lerp(-0.5, 0.5, d / K)
        }
        else {
            this.a = a + Math.PI * 0.5
        }

        const x = this.x + this.u * t
        const y = this.y + this.v * t

        d = hypot(x, y)

        if (d > R) {
            if (d > K * 2) {
                respawn()
                return
            }

            this.x = x
            this.y = y
        }
        else {
            this.x = R * x / d
            this.y = R * y / d
            this.u = this.v = 0
        }
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
