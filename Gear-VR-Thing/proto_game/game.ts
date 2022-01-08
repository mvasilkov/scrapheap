const spacebar = 0x20
let spacebarDown = false

document.body.addEventListener('keydown', function (event) {
    if (event.keyCode == spacebar) {
        spacebarDown = true
        event.preventDefault()
    }
})

document.body.addEventListener('keyup', function (event) {
    if (event.keyCode == spacebar) {
        spacebarDown = false
        event.preventDefault()
    }
})

const width = 960
const height = 720
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const c = canvas.getContext('2d') as CanvasRenderingContext2D

c.translate(width * 0.5, height * 0.5)

let starship = new Starship

function respawn() {
    starship = new Starship
}

let then = -1
let t = 0

function mainloop(now: number) {
    requestAnimationFrame(mainloop)

    if (spacebarDown) {
        starship.thrust()
    }

    if (then == -1) {
        then = now
    }
    t += (now - then) * 0.001
    then = now

    while (t > 0) {
        t -= T
        starship.update(T)
    }

    c.clearRect(width * -0.5, height * -0.5, width, height)

    paintGround(c)
    paintDangerZone(c)

    starship.paint(c, t / T + 1)
}

requestAnimationFrame(mainloop)
