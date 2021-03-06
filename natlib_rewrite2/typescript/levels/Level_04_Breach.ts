'use strict'
import { Vec2 } from '../../node_modules/natlib/Vec2.js'
import { Box } from '../Box.js'
import { Settings } from '../natlib/Prelude.js'
import { Wall } from '../Wall.js'
import { TheWall } from './Level_02_TheWall.js'

export class Breach extends TheWall {
    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        const y0 = (Settings.screenHeight - 64 * 8) * 0.5

        for (let n = 0; n < 8; ++n) {
            if (n < 2 || n > 5) {
                new Box(this, startingPoint.x + 256 + 32, y0 + n * 64 + 32, 64, 0.5, 0.5)
            }
        }

        new Wall(this, startingPoint.x + 256, y0 - 256, 1, 9999)
        new Wall(this, startingPoint.x + 256, Settings.screenHeight - y0, 1, 9999)
    }

    getIndex() {
        return 3
    }
}
