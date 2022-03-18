'use strict'
import { Body } from '../node_modules/natlib/verlet/Body.js'
import { Constraint } from '../node_modules/natlib/verlet/Constraint.js'
import { Scene } from '../node_modules/natlib/verlet/Scene.js'
import { Vertex } from '../node_modules/natlib/verlet/Vertex.js'
import { HALFPI } from './natlib/Utils.js'

export class FiringPin extends Body {
    constructor(scene: Scene, x: number, y: number, r: number, angle = 0, stiffness = 1, mass = 9) {
        super(scene, mass)

        const theta = HALFPI

        // Create vertices.
        for (let i = 0; i < 4; ++i) {
            const a = theta * i + angle
            new Vertex(this as any, x + r * Math.cos(a), y + r * Math.sin(a))
        }

        // Create constraints.
        for (let i = 0; i < this.vertices.length - 1; ++i) {
            for (let j = i + 1; j < this.vertices.length; ++j) {
                new Constraint(this as any, this.vertices[i], this.vertices[j], j === i + 1, stiffness)
            }
        }
    }

    retract() {
        // undo vertices
        this.scene.vertices.length -= this.vertices.length

        // undo constraints
        this.scene.constraints.length -= this.constraints.length

        // undo body
        this.scene.bodies.pop()
    }

    paint() {
    }
}
