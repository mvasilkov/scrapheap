'use strict'
import { IVec2 } from '../../node_modules/natlib/typescript/Vec2.js'
import { $canvas, uiScale } from './Canvas.js'
import { NVertex } from './NVertex.js'

interface IPointer extends IVec2 {
    dragging: boolean
    x: number
    y: number
    vertex?: NVertex
}

/** The pointer. */
export const pointer: IPointer = {
    dragging: false,
    x: 0,
    y: 0,
}

/** Set the pointer position. */
function setPointerPosition(event: MouseEvent | Touch) {
    const r = $canvas.getBoundingClientRect()
    pointer.x = (event.clientX - r.left) * uiScale
    pointer.y = (event.clientY - r.top) * uiScale
}

/** Mouse events. */
document.addEventListener('mousedown', event => {
    event.preventDefault()

    pointer.dragging = true
    setPointerPosition(event)
})

document.addEventListener('mousemove', event => {
    event.preventDefault()

    setPointerPosition(event)
})

document.addEventListener('mouseup', event => {
    event.preventDefault()

    pointer.dragging = false
    pointer.vertex = undefined
})

/** Touch events. */
document.addEventListener('touchstart', event => {
    event.preventDefault()

    pointer.dragging = true
    setPointerPosition(event.targetTouches[0])
})

document.addEventListener('touchmove', event => {
    event.preventDefault()

    setPointerPosition(event.targetTouches[0])
})

document.addEventListener('touchend', event => {
    event.preventDefault()

    pointer.dragging = false
    pointer.vertex = undefined
})

document.addEventListener('touchcancel', event => {
    event.preventDefault()

    pointer.dragging = false
    pointer.vertex = undefined
})
