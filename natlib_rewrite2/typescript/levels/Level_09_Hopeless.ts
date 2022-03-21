'use strict'
import { Vec2 } from '../../node_modules/natlib/Vec2.js'
import { InternetExplorer } from '../InternetExplorer.js'
import { Level, LevelState } from '../Level.js'
import { Settings } from '../natlib/Prelude.js'
import { NoWebsite } from '../NoWebsite.js'
import { WebsiteBox } from '../WebsiteBox.js'

export class Hopeless extends Level {
    static getUserAgent() {
        return InternetExplorer
    }

    constructor(startingPoint: Vec2, curtain = 0) {
        super(startingPoint, curtain)

        this.website = new NoWebsite
        this.duration = 196
        this.autoWin = true

        new WebsiteBox(this,
            Settings.screenWidth - Settings.websiteWidth - 1,
            (Settings.screenHeight - Settings.websiteHeight) * 0.5)
    }

    update() {
        let gravity: number
        let fg: number

        if (this.state === LevelState.WAITING || this.state === LevelState.FAILING || this.state === LevelState.WINNING) {
            gravity = 0.9
            fg = 0.5
        }
        else {
            gravity = Settings.kGravity
            fg = Settings.kFrictionGround
        }

        for (const b of this.bodies) {
            b.groundFriction = fg
        }

        for (let i = 0; i < this.vertices.length; ++i) {
            this.vertices[i].gravity = gravity
        }

        super.update()
    }

    getIndex() {
        return 8
    }
}
