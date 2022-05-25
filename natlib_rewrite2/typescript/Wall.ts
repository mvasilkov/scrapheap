'use strict'
import { Body } from '../node_modules/natlib/verlet/Body.js'
import { Constraint } from '../node_modules/natlib/verlet/Constraint.js'
import { Scene } from '../node_modules/natlib/verlet/Scene.js'
import { StaticVertex } from '../node_modules/natlib/verlet/StaticVertex.js'
import { FAILURE_BACK, WALL_PICTURE } from './Background.js'
import { register0, Settings } from './natlib/Prelude.js'

export class Wall extends Body {
    constructor(scene: Scene, x: number, y: number, stiffness = 1, mass = 9) {
        super(scene, mass)

        // Create vertices.
        const v0 = new StaticVertex(this as any, x, y)
        const v1 = new StaticVertex(this as any, x + 64, y)
        const v2 = new StaticVertex(this as any, x + 64, y + 256)
        const v3 = new StaticVertex(this as any, x, y + 256)

        // Create edges.
        new Constraint(this as any, v0, v1, true, stiffness)
        new Constraint(this as any, v1, v2, true, stiffness)
        new Constraint(this as any, v2, v3, true, stiffness)
        new Constraint(this as any, v3, v0, true, stiffness)

        // Create constraints.
        new Constraint(this as any, v0, v2, false, stiffness)
        new Constraint(this as any, v1, v3, false, stiffness)

        this.center.set(x + 32, y + 128)
        this.halfExtents.set(32, 128)
    }

    rotate(angle: number) {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        for (const vert of <StaticVertex[]>this.vertices) {
            register0.setSubtract(vert.position, this.center)
            vert.x = this.center.x + register0.x * cos - register0.y * sin
            vert.y = this.center.y + register0.x * sin + register0.y * cos
            vert.integrate(Settings.screenWidth, Settings.screenHeight)
        }
    }

    paint(canvas: CanvasRenderingContext2D, t: number) {
        // Interpolate vertices.
        for (const vert of this.vertices) vert.interpolate(t)

        // Trace path.
        canvas.beginPath()

        for (let n = 0; n < 4; ++n) {
            canvas.lineTo(this.vertices[n].interpolated.x, this.vertices[n].interpolated.y)
        }

        canvas.closePath()

        // Paint background.
        canvas.save()

        canvas.clip()

        canvas.drawImage(WALL_PICTURE.canvas, 0, 0, Settings.screenWidth, Settings.screenHeight)

        canvas.restore()

        // Paint edges.
        canvas.strokeStyle = FAILURE_BACK
        canvas.stroke()
    }
}
