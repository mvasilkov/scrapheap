/* This file is part of natlib.
 * natlib, a library for games, is planned to release in early 2021.
 * https://github.com/mvasilkov/natlib
 */
'use strict'
import { Vec2 } from '../../node_modules/natlib/typescript/Vec2.js'
import { NBody } from './NBody.js'
import { Settings } from './Prelude.js'
import { lerp } from './Utils.js'

/** A Verlet integration vertex. */
export class NVertex {
    parent: NBody
    position: Vec2
    oldPosition: Vec2
    interpolated: Vec2

    /** Create a new vertex. */
    constructor(parent: NBody, x: number, y: number) {
        this.parent = parent
        this.position = new Vec2(x, y)
        this.oldPosition = new Vec2(x, y)
        this.interpolated = new Vec2

        parent.vertices.push(this)
        parent.positions.push(this.position)
        parent.scene.vertices.push(this)
    }

    /** Verlet integration. */
    integrate(gravity = Settings.kGravity, fg = Settings.kFrictionGround) {
        const pos = this.position
        const old = this.oldPosition
        const x = pos.x
        const y = pos.y

        pos.x += (pos.x - old.x) * Settings.kViscosity
        pos.y += (pos.y - old.y) * Settings.kViscosity + gravity

        old.set(x, y)

        // screen limits
        if (pos.y < 0) pos.y = 0
        else if (pos.y >= Settings.screenHeight) {
            pos.x -= (pos.x - old.x) * fg
            pos.y = Settings.screenHeight - 1
        }

        if (pos.x < 0) pos.x = 0
        else if (pos.x >= Settings.screenWidth) {
            pos.x = Settings.screenWidth - 1
        }
    }

    /** Interpolate this vertex. */
    interpolate(t: number) {
        this.interpolated.set(
            lerp(this.oldPosition.x, this.position.x, t),
            lerp(this.oldPosition.y, this.position.y, t)
        )
    }
}
