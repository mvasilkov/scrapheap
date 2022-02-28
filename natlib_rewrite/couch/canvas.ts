import { endScreen, startScreen } from './game.js'

export const cwidth = 960
export const cheight = 540
const aspect = 16 / 9

export let cscale = 1

export const container = <HTMLElement>document.getElementById('container')
export const backcanvas = <HTMLCanvasElement>document.getElementById('backcanvas')
export const canvas = <HTMLCanvasElement>document.getElementById('canvas')
export const backcontext = <CanvasRenderingContext2D>backcanvas.getContext('2d')
export const context = <CanvasRenderingContext2D>canvas.getContext('2d')

let transformProperty = 'transform'
if (!(transformProperty in container.style)) {
    transformProperty = 'webkitTransform'
}

backcanvas.width = canvas.width = cwidth
backcanvas.height = canvas.height = cheight

context.lineWidth = 2
context.textAlign = 'center'
context.textBaseline = 'middle'

function setSize(x: HTMLElement, property: string, value: number) {
    x.style[<any>property] = `${value}px`
}

export function handleResize() {
    let w = window.innerWidth
    let h = window.innerHeight

    if (w / h > aspect)
        w = h * aspect
    else
        h = w / aspect

    cscale = cwidth / w

    setSize(container, 'width', w)
    setSize(container, 'height', h)
    setSize(container, 'left', 0.5 * (window.innerWidth - w))
    setSize(container, 'top', 0.5 * (window.innerHeight - h))

    const scale = 0.5 * w / cwidth
    const scale3d = `scale3d(${scale},${scale},1)`

    startScreen.style[<any>transformProperty] = scale3d
    endScreen.style[<any>transformProperty] = scale3d
}

//handleResize()
window.addEventListener('resize', handleResize)
window.addEventListener('orientationchange', handleResize)

canvas.addEventListener('contextmenu', event => {
    event.preventDefault()
})
