'use strict'
import { Body } from '../node_modules/natlib/verlet/Body.js'
import { Constraint } from '../node_modules/natlib/verlet/Constraint.js'
import { Scene } from '../node_modules/natlib/verlet/Scene.js'
import { Vertex } from '../node_modules/natlib/verlet/Vertex.js'
import { FOURTHPI, HALFPI } from './natlib/Utils.js'
import { Wall } from './Wall.js'

export class Box extends Body {
    constructor(scene: Scene, x: number, y: number, size: number, stiffness = 0.5, mass = 1) {
        super(scene, mass)

        this.center.set(x, y)
        this.halfExtents.set(size * 0.5, size * 0.5)

        const theta = HALFPI
        const r = this.halfExtents.length()

        // Create vertices.
        for (let i = 0; i < 4; ++i) {
            const a = theta * i + FOURTHPI
            new Vertex(this as any, x + r * Math.cos(a), y + r * Math.sin(a))
        }

        // Create constraints.
        for (let i = 0; i < this.vertices.length - 1; ++i) {
            for (let j = i + 1; j < this.vertices.length; ++j) {
                new Constraint(this as any, this.vertices[i], this.vertices[j], j === i + 1, stiffness)
            }
        }
    }
}

Box.prototype.paint = Wall.prototype.paint
