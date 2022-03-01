import { container, cscale } from './canvas.js'
import { bodies, constraints, init, setDraggingPoint, vertices } from './main.js'
import { pointer } from './pointer.js'

export const isMobile = navigator.userAgent.match(/Android|iPhone|iPad/i) != null

export const loadingScreen = <HTMLElement>document.getElementById('load')
export const startScreen = <HTMLElement>document.getElementById('home')
export const startButton = <HTMLElement>document.getElementById('start')
export const endScreen = <HTMLElement>document.getElementById('end')
export const resetButton = <HTMLElement>document.getElementById('reset')

startScreen.addEventListener('mousedown', cancel)
startScreen.addEventListener('touchstart', cancel)

startButton.addEventListener('mousedown', start)
startButton.addEventListener('touchstart', start)

endScreen.addEventListener('mousedown', cancel)
endScreen.addEventListener('touchstart', cancel)

resetButton.addEventListener('mousedown', reset)
resetButton.addEventListener('touchstart', reset)

function cancel(event: Event) {
    const target = <HTMLElement>event.target
    if (target.tagName != 'INPUT' && target.tagName != 'LABEL') {
        event.preventDefault()
        event.stopPropagation()
    }
}

function start() {
    container.removeChild(startScreen)

    if ((isMobile || cscale > 1) && document.body.requestFullscreen) {
        document.body.requestFullscreen()
    }
}

export function gameover() {
    endScreen.style.display = 'block'
}

function reset() {
    endScreen.style.display = 'none'

    bodies.length = 0
    vertices.length = 0
    constraints.length = 0

    setDraggingPoint(null)
    pointer.dragging = false

    init()
}
