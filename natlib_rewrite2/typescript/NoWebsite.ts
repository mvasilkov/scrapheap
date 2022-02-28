'use strict'
import { Website } from './Website.js'

export class NoWebsite extends Website {
    contains() {
        return false
    }

    paint() {
    }
}
