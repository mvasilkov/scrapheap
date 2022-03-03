'use strict'
import { Vec2 } from '../../node_modules/natlib/Vec2.js'
import { InternetExplorer } from '../InternetExplorer.js'
import { Level, LevelState } from '../Level.js'
import { register0, Settings } from '../natlib/Prelude.js'
import { UserAgent } from '../UserAgent.js'

export class Distancing extends Level {
    clone: UserAgent

    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        this.clone = new InternetExplorer(this,
            Settings.screenWidth - Settings.websiteWidth * 0.5,
            Settings.screenHeight * 0.5)
    }

    /** Verlet integration loop. */
    integrate() {
        do {
            if (this.state !== LevelState.WAITING) break

            register0.setSubtract(this.projectile.center, this.clone.center)

            // normalize
            const length = register0.length()
            if (length < 64) break
            register0.scale(1 / length)

            // Move the clone.
            for (const vert of this.clone.vertices) {
                vert.position.add(register0)
            }
        }
        while (false)

        super.integrate()
    }

    getIndex() {
        return 7
    }
}
