'use strict'

import { canvas, setSize } from './Canvas.js'

export const TWOPI = 2 * Math.PI
export const HALFPI = 0.5 * Math.PI
export const FOURTHPI = 0.25 * Math.PI
export const EIGHTHPI = 0.125 * Math.PI

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t
}

/** Quadratic easing. */
export function easeInQuad(t: number) {
    return t * t
}

export function easeOutQuad(t: number) {
    return t * (2 - t)
}

export function easeInOutQuad(t: number) {
    return t < 0.5 ?
        2 * t * t :
        2 * t * (2 - t) - 1
}

export function inverseRescale(a: number, start0: number, end0: number, start1: number, end1: number) {
    return (1 - (a - start0) / (end0 - start0)) * (end1 - start1) + start1
}

/** Get one element by class name. */
export function $(selector: string) {
    return document.querySelector(selector)!
}

/** Get elements by class name. */
export function $$(selector: string) {
    return document.querySelectorAll(selector)
}

/** Make it so that the passed coords are in the (0, 0) – (512, 512) range. */
export function enclose(x0: number, y0: number, x1: number, y1: number) {
    canvas.translate(x0, y0)
    canvas.scale((x1 - x0) / 512, (y1 - y0) / 512)
}

/** A rendering function. */
type RenderFun = (canvas: CanvasRenderingContext2D) => void

/** Render a static picture on canvas. */
export function prerender(width: number, height: number, render: RenderFun): HTMLCanvasElement {
    const $can = document.createElement('canvas')
    const can = $can.getContext('2d')!

    setSize($can, can, width, height)
    render(can)

    return $can
}
