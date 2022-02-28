'use strict'
import { Settings } from './Prelude.js'
import { $ } from './Utils.js'

export function setSize($can: HTMLCanvasElement, can: CanvasRenderingContext2D, width: number, height: number) {
    if (window.devicePixelRatio > 1.44) {
        $can.height = 2 * height
        $can.width = 2 * width

        can.scale(2, 2)
    }
    else {
        $can.height = height
        $can.width = width
    }
}

export const $canvas = <HTMLCanvasElement>$('.can')
export const canvas = $canvas.getContext('2d')!

setSize($canvas, canvas, Settings.screenWidth, Settings.screenHeight)

// #region Autosize canvas.
const aspectRatio = 16 / 9

export let uiScale = 1

let transformProperty: 'transform' | 'webkitTransform' = 'transform'
if (!(transformProperty in $canvas.style)) {
    transformProperty = 'webkitTransform'
}

const hasVisualViewport = typeof visualViewport !== 'undefined'

export function handleResize() {
    let w = hasVisualViewport ? visualViewport.width : innerWidth
    let h = hasVisualViewport ? visualViewport.height : innerHeight

    if (w / h > aspectRatio)
        w = h * aspectRatio
    else
        h = w / aspectRatio

    uiScale = Settings.screenWidth / w

    const k = w / Settings.screenWidth

    $canvas.style[transformProperty] = `scale3d(${k},${k},1)`
}

addEventListener('resize', handleResize)
addEventListener('orientationchange', handleResize)
if (hasVisualViewport) visualViewport.addEventListener('resize', handleResize)
// #endregion

export const systemFont = `16px -apple-system, 'Segoe UI', system-ui, Roboto, sans-serif`
export const systemFontHeading = systemFont.replace('16', 'bold 48')

$canvas.addEventListener('contextmenu', event => {
    event.preventDefault()
})
