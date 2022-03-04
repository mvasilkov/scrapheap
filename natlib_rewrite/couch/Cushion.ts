import { Body } from './Body.js'
import { bodies } from './main.js'
import { Body as XBody } from './node_modules/natlib/verlet/Body.js'
import { Constraint } from './node_modules/natlib/verlet/Constraint.js'
import { Scene } from './node_modules/natlib/verlet/Scene.js'
import { StaticVertex } from './node_modules/natlib/verlet/StaticVertex.js'
import { Vertex } from './node_modules/natlib/verlet/Vertex.js'

export class Cushion extends Body {
    handle0: Vertex
    handle1: Vertex

    static chamfer = 10

    constructor(scene: Scene, x: number, y: number, width: number, height: number, append: boolean = true) {
        super(scene, 250)

        const p0 = this.handle0 = new Vertex(this as unknown as XBody, x, y + Cushion.chamfer)
        const p1 = new Vertex(this as unknown as XBody, x + Cushion.chamfer, y)
        const p2 = new Vertex(this as unknown as XBody, x + width - Cushion.chamfer, y)
        const p3 = this.handle1 = new Vertex(this as unknown as XBody, x + width, y + Cushion.chamfer)
        const p4 = new StaticVertex(this as unknown as XBody, x + width, y + height)
        const p5 = new StaticVertex(this as unknown as XBody, x, y + height)

        // @ts-ignore
        new Constraint(this, p0, p1, true, 0.1)
        // @ts-ignore
        new Constraint(this, p1, p2, true, 0.1)
        // @ts-ignore
        new Constraint(this, p2, p3, true, 0.1)
        // @ts-ignore
        new Constraint(this, p3, p4, true, 0.1)
        // @ts-ignore
        new Constraint(this, p4, p5, true, 0.1)
        // @ts-ignore
        new Constraint(this, p5, p0, true, 0.1)

        // @ts-ignore
        new Constraint(this, p0, p3, false, 0.1)
        // @ts-ignore
        new Constraint(this, p0, p4, false, 0.1)
        // @ts-ignore
        new Constraint(this, p1, p4, false, 0.1)
        // @ts-ignore
        new Constraint(this, p1, p5, false, 0.1)
        // @ts-ignore
        new Constraint(this, p2, p4, false, 0.1)
        // @ts-ignore
        new Constraint(this, p2, p5, false, 0.1)
        // @ts-ignore
        new Constraint(this, p3, p5, false, 0.1)

        if (append) {
            bodies.push(this)
        }
    }

    paint(context: CanvasRenderingContext2D, color?: string) {
        context.beginPath()

        let p0 = this.positions[0]
        let p1 = this.positions[1]

        context.moveTo(0.5 * (p0.x + p1.x), 0.5 * (p0.y + p1.y))

        for (let i = 1; i <= 6 /*this.positions.length*/; ++i) {
            // bottom part
            if (i == 4 || i == 5) {
                context.lineTo(this.positions[i].x, this.positions[i].y)
                continue
            }

            p0 = this.positions[i % 6 /*this.positions.length*/]
            p1 = this.positions[(i + 1) % 6 /*this.positions.length*/]

            context.quadraticCurveTo(p0.x, p0.y, 0.5 * (p0.x + p1.x), 0.5 * (p0.y + p1.y))
        }

        context.fillStyle = color || '#00B0FF'
        context.fill()
    }

    paintLow(context: CanvasRenderingContext2D, color?: string) {
        context.beginPath()

        for (let p of this.positions) {
            context.lineTo(p.x, p.y)
        }

        context.fillStyle = color || '#00B0FF'
        context.fill()
    }
}
