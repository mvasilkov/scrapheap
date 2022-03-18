'use strict'
import { IVec2, Vec2 } from '../node_modules/natlib/Vec2.js'
import { Body } from '../node_modules/natlib/verlet/Body.js'
import { Constraint } from '../node_modules/natlib/verlet/Constraint.js'
import { Scene } from '../node_modules/natlib/verlet/Scene.js'
import { StaticVertex } from '../node_modules/natlib/verlet/StaticVertex.js'
import { Vertex } from '../node_modules/natlib/verlet/Vertex.js'
import { FAILURE_BACK } from './Background.js'
import { pointer } from './natlib/Pointer.js'
import { Settings } from './natlib/Prelude.js'
import { TWOPI } from './natlib/Utils.js'

export class Reticle extends Body {
    startingVertex: Vertex
    targetingVertex: Vertex
    lastPosition: Vec2

    constructor(scene: Scene, startingPoint: IVec2) {
        super(scene)
        this.startingVertex = new StaticVertex(this as any, startingPoint.x, startingPoint.y)
        this.targetingVertex = new Vertex(this as any, startingPoint.x - 0.001, startingPoint.y)
        this.lastPosition = new Vec2(startingPoint.x, startingPoint.y)

        const cons = new Constraint(this as any, this.startingVertex, this.targetingVertex,
            false, Settings.reticleStiffness)

        // Make the starting vertex stay in place.
        const originalSolve = cons.solve
        cons.solve = () => {
            if (pointer.vertex) return // Do nothing while dragging.
            originalSolve.call(cons)
            this.startingVertex.position.copy(startingPoint)
        }
    }

    paint(canvas: CanvasRenderingContext2D, t: number) {
        // Interpolate vertices.
        this.targetingVertex.interpolate(t)

        const start = this.startingVertex.position
        const pos = this.targetingVertex.interpolated

        canvas.beginPath()
        canvas.moveTo(pos.x, pos.y)
        canvas.lineTo(start.x, start.y)
        canvas.strokeStyle = FAILURE_BACK
        canvas.stroke()

        canvas.beginPath()
        canvas.arc(pos.x, pos.y, 9, 0, TWOPI)
        canvas.arc(start.x, start.y, 4, 0, TWOPI)
        canvas.fillStyle = FAILURE_BACK
        canvas.fill()
    }
}
