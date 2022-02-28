'use strict'
import { Vec2 } from '../../node_modules/natlib/typescript/Vec2.js'
import { Level } from '../Level.js'
import { Settings } from '../natlib/Prelude.js'
import { Wall } from '../Wall.js'

export class TheWall extends Level {
    wall: Wall

    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        this.wall = new Wall(this, startingPoint.x + 256, (Settings.screenHeight - 256) * 0.5, 1, 9999)
    }

    getIndex() {
        return 1
    }
}
