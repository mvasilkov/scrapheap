/* This file is part of natlib.
 * natlib, a library for games, is planned to release in early 2021.
 * https://github.com/mvasilkov/natlib
 */
'use strict'
import { Vec2 } from '../../node_modules/natlib/typescript/Vec2.js'
import { NBody } from './NBody.js'
import { NVertex } from './NVertex.js'
import { register0 } from './Prelude.js'

/** A Verlet integration constraint. */
export class NConstraint {
    parent: NBody
    v0: NVertex
    v1: NVertex
    p0: Vec2
    p1: Vec2
    dist: number
    edge: boolean
    stiffness: number

    /** Create a new constraint. */
    constructor(parent: NBody, v0: NVertex, v1: NVertex, edge = false, stiffness = 1) {
        this.parent = parent
        this.v0 = v0
        this.v1 = v1
        this.p0 = v0.position
        this.p1 = v1.position
        this.dist = this.p0.distanceSquared(this.p1)
        this.edge = edge
        this.stiffness = stiffness

        if (!this.dist) throw Error('Overlapping vertices.')

        parent.constraints.push(this)
        if (edge) parent.edges.push(this)
        parent.scene.constraints.push(this)
    }

    /** Solve this constraint. */
    solve() {
        register0.setSubtract(this.p0, this.p1)

        // using square root approximation
        const a = this.dist / (register0.dot(register0) + this.dist) - 0.5
        register0.scale(a * this.stiffness)

        this.p0.add(register0)
        this.p1.subtract(register0)
    }
}
