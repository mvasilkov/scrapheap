'use strict'
import { IVec2, Vec2 } from '../node_modules/natlib/Vec2.js'
import { FAILURE_BACK } from './Background.js'
import { NBody } from './natlib/NBody.js'
import { NConstraint } from './natlib/NConstraint.js'
import { NScene } from './natlib/NScene.js'
import { NStaticVertex } from './natlib/NStaticVertex.js'
import { NVertex } from './natlib/NVertex.js'
import { pointer } from './natlib/Pointer.js'
import { Settings } from './natlib/Prelude.js'
import { TWOPI } from './natlib/Utils.js'

export class Reticle extends NBody {
    startingVertex: NVertex
    targetingVertex: NVertex
    lastPosition: Vec2

    constructor(scene: NScene, startingPoint: IVec2) {
        super(scene)
        this.startingVertex = new NStaticVertex(this, startingPoint.x, startingPoint.y)
        this.targetingVertex = new NVertex(this, startingPoint.x - 0.001, startingPoint.y)
        this.lastPosition = new Vec2(startingPoint.x, startingPoint.y)

        const cons = new NConstraint(this, this.startingVertex, this.targetingVertex,
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
