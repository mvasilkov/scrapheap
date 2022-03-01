'use strict'
import { Vec2 } from '../../node_modules/natlib/out/Vec2.js'
import { Level } from '../Level.js'
import { Settings } from '../natlib/Prelude.js'
import { EIGHTHPI } from '../natlib/Utils.js'
import { Wall } from '../Wall.js'

export class Opening extends Level {
    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        new Wall(this, startingPoint.x + 256, (Settings.screenHeight - 256) * 0.5 - 140, 1, 9999)
            .rotate(EIGHTHPI)

        new Wall(this, startingPoint.x + 256, (Settings.screenHeight - 256) * 0.5 + 140, 1, 9999)
            .rotate(-EIGHTHPI)
    }

    getIndex() {
        return 2
    }
}
