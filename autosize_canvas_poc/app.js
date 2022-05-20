'use strict'

import { CanvasHandle } from './node_modules/natlib/canvas/CanvasHandle.js'

const canvas = new CanvasHandle(document.querySelector('#can'), 960, 540)
const con = canvas.con

con.fillStyle = '#101010'
con.fillRect(0, 0, canvas.width, canvas.height)

con.fillStyle = '#fbfbfb'
con.fillRect(0.5 * canvas.width - 20, 40, 40, 40)
