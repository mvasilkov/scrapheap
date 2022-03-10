/* This file is part of natlib.
 * natlib, a library for games, is planned to release in early 2021.
 * https://github.com/mvasilkov/natlib
 */
'use strict'
import { Constraint } from '../../node_modules/natlib/verlet/Constraint.js'
import { Vertex } from '../../node_modules/natlib/verlet/Vertex.js'
import { NBody } from './NBody.js'
import { Settings } from './Prelude.js'
import { satResolve } from './SAT.js'

/** A scene. */
export class NScene {
    vertices: Vertex[]
    constraints: Constraint[]
    bodies: NBody[]

    /** Create a new scene. */
    constructor() {
        this.vertices = []
        this.constraints = []
        this.bodies = []
    }

    /** Verlet integration loop. */
    integrate() {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i].integrate(Settings.screenWidth, Settings.screenHeight)
        }
    }

    /** Solve constraints and collisions. */
    solve() {
        for (let n = 0; n < Settings.kNumIterations; ++n) {
            // Solve constraints.
            for (const c of this.constraints) {
                c.solve()
            }

            // Recalculate the bounding boxes.
            for (const b of this.bodies) {
                b.boundingBox()
            }

            // Collision detection.
            for (let i = 0; i < this.bodies.length - 1; ++i) {
                for (let j = i + 1; j < this.bodies.length; ++j) {
                    satResolve(this.bodies[i], this.bodies[j])
                }
            }
        }
    }
}
