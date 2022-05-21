'use strict'

import { CanvasHandle } from './node_modules/natlib/canvas/CanvasHandle.js'
import { setupAutoScale } from './autoscale.js'

const canvas = new CanvasHandle(document.querySelector('#canvas1'), 960, 540)
const con = canvas.con

con.fillStyle = '#101010'
con.fillRect(0, 0, canvas.width, canvas.height)

con.fillStyle = '#fbfbfb'
con.fillRect(0.5 * canvas.width - 20, 40, 40, 40)

setupAutoScale(document.querySelector('#autoscale1'), 960, 540)
