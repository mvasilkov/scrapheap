'use strict'
import { Vec2 } from '../../node_modules/natlib/typescript/Vec2.js'
import { FAILURE_MOVED_PICTURE } from '../Background.js'
import { Level, LevelState } from '../Level.js'
import { MovingWebsite } from '../MovingWebsite.js'

export class Moving extends Level {
    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        this.website = new MovingWebsite
        this.curtainPicture = FAILURE_MOVED_PICTURE
    }

    /** Solve constraints and collisions. */
    solve() {
        super.solve()

        if (this.state === LevelState.WAITING || this.state === LevelState.FAILING || this.state === LevelState.WINNING) {
            this.website.update()
        }
    }

    getIndex() {
        return 6
    }
}
