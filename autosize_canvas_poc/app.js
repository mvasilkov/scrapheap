'use strict'

import { CanvasHandle } from './node_modules/natlib/canvas/CanvasHandle.js'
import { Pointer } from './node_modules/natlib/controls/Pointer.js'
import { startMainloop } from './node_modules/natlib/scheduling/mainloop.js'
import { AutoScaleWrapper } from './node_modules/natlib/viewport/AutoScaleWrapper.js'
import { AutoRotateWrapper } from './node_modules/natlib/viewport/AutoRotateWrapper.js'

const canvas = new CanvasHandle(document.querySelector('#canvas1'), 960, 540)
const con = canvas.con

con.fillStyle = '#101010'
con.fillRect(0, 0, canvas.width, canvas.height)

con.fillStyle = '#fbfbfb'
con.fillRect(0.5 * canvas.width - 20, 40, 40, 40)

// const autoscale = new AutoScaleWrapper(document.querySelector('#autoscale1'), 960, 540)
const autoscale = new AutoRotateWrapper(document.querySelector('#autoscale1'), 960, 540)
autoscale.addEventListeners()

// Code to display pointer

function initPointer() {
    const pointer = new Pointer(canvas.canvas)
    pointer.addEventListeners(document)

    function update() {
    }

    function render() {
        con.clearRect(0, 0, canvas.width, canvas.height)

        con.fillStyle = '#101010'
        con.fillRect(0, 0, canvas.width, canvas.height)

        con.fillStyle = '#fbfbfb'
        con.fillRect(0.5 * canvas.width - 20, 40, 40, 40)

        paintDebugPointer(con, pointer)
    }

    startMainloop(update, render)
}

function paintDebugPointer(con, pointer) {
    con.save()
    con.translate(0.5, 0.5)

    con.beginPath()
    con.moveTo(pointer.x - 20, pointer.y)
    con.lineTo(pointer.x + 20, pointer.y)
    con.moveTo(pointer.x, pointer.y - 20)
    con.lineTo(pointer.x, pointer.y + 20)

    con.strokeStyle = pointer.held === true ? '#FF004D' : '#00E436'
    con.stroke()

    con.restore()
}

initPointer()
