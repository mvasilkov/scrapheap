'use strict'
import { IVec2, Vec2 } from '../../node_modules/natlib/Vec2.js'
import { NStaticVertex } from '../natlib/NStaticVertex.js'
import { register0 } from '../natlib/Prelude.js'
import { HALFPI } from '../natlib/Utils.js'
import { TheWall } from './Level_02_TheWall.js'

export class Banned extends TheWall {
    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        this.duration = 196
    }

    updateTargeting(pos: IVec2) {
        this.reticle.lastPosition.copy(pos)

        // Place the wall.
        register0.setSubtract(this.startingPoint, pos)
        if (register0.length() < 16) return

        const a = Math.atan2(register0.y, register0.x)
        const cos64 = 64 * Math.cos(a)
        const sin64 = 64 * Math.sin(a)

        register0.scale(256 / register0.length())
        register0.add(this.startingPoint)

        const v = <NStaticVertex[]>this.wall.vertices
        let x = register0.x + 128 * Math.cos(a - HALFPI)
        let y = register0.y + 128 * Math.sin(a - HALFPI)

        v[0].set(x, y)
        v[1].set(x + cos64, y + sin64)

        x = register0.x + 128 * Math.cos(a + HALFPI)
        y = register0.y + 128 * Math.sin(a + HALFPI)

        v[2].set(x + cos64, y + sin64)
        v[3].set(x, y)
    }

    getIndex() {
        return 4
    }
}
