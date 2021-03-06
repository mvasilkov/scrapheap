import { Body } from './Body.js'
import { cheight, context, cwidth } from './canvas.js'
import { Cushion } from './Cushion.js'
import { gameover } from './game.js'
import { findCollision, resolveCollision } from './node_modules/natlib/collision/sat.js'
import { integrateVertex } from './node_modules/natlib/examples/couch2048/functions.js'
import { debounce } from './node_modules/natlib/scheduling/debounce.js'
import { Vec2 } from './node_modules/natlib/Vec2.js'
import { Body as XBody, detachBody } from './node_modules/natlib/verlet/Body.js'
import { Constraint } from './node_modules/natlib/verlet/Constraint.js'
import { Scene } from './node_modules/natlib/verlet/Scene.js'
import { Vertex } from './node_modules/natlib/verlet/Vertex.js'
import { Piece } from './Piece.js'
import { pointer } from './pointer.js'

export const kGravity = 0.6
export const kAttractiveForce = 0.1
export const kNumIterations = 40
export const kFriction = 0.9
export const kFrictionGround = 0.6
export const kForceDrag = 0.24

export const scene = new Scene(960, 540, 10, kFriction)

export let bodies = scene.bodies as unknown as Body[]
export let vertices = scene.vertices as unknown as Vertex[]
export let constraints = scene.constraints as Constraint[]

export let draggingPoint: Vertex | null = null

export function setDraggingPoint(point: Vertex | null) {
    draggingPoint = point
}

export const register0 = new Vec2
export const register1 = new Vec2

export const count: { [n: number]: number } = {}

//const numberOfCushions = 3

export function mainloop() {
    context.clearRect(0, 0, cwidth, cheight)

    for (let p of vertices) {
        p.integrate(scene.width, scene.height)
    }

    let addPieces = false

    for (let i = 3 /*numberOfCushions*/; i < bodies.length; ++i) {
        const b = bodies[i] as Piece
        //if (!(b instanceof Piece)) continue

        if (b.center.y >= cheight + b.r) {
            detachBody(b as unknown as XBody)

            // @ts-ignore
            if (draggingPoint && draggingPoint.body == b) {
                draggingPoint = null
                pointer.dragging = false
            }

            --count[b.n]

            addPieces = true

            --i
        }
    }

    for (let i = 3 /*numberOfCushions*/; i < bodies.length - 1; ++i) {
        const b = bodies[i] as Piece
        //if (!(b instanceof Piece)) continue

        const attractDistance = 2.5 * b.r
        let minDistance = 99999
        let other: Piece | null = null
        let index = 0

        for (let j = i + 1; j < bodies.length; ++j) {
            const bb = bodies[j] as Piece
            //if (!(bb instanceof Piece)) continue
            if (b.n != bb.n) continue

            const distance = b.center.distanceSquared(bb.center) ** 0.5
            if (distance < attractDistance && distance < minDistance) {
                minDistance = distance
                other = bb
                index = j
            }
        }

        if (!other) continue

        const x = 0.5 * (b.center.x + other.center.x)
        const y = 0.5 * (b.center.y + other.center.y)

        if (minDistance > 2 * b.r) {
            for (let p of b.positions) {
                p.x += (x - p.x) * kAttractiveForce
                p.y += (y - p.y) * kAttractiveForce
            }

            for (let p of other.positions) {
                p.x += (x - p.x) * kAttractiveForce
                p.y += (y - p.y) * kAttractiveForce
            }
        }
        else {
            detachBody(b as unknown as XBody)
            detachBody(other as unknown as XBody)

            // @ts-ignore
            if (draggingPoint && (draggingPoint.body == b || draggingPoint.body == other)) {
                draggingPoint = null
                pointer.dragging = false
            }

            new Piece(scene, x, y, b.n << 1)

            count[b.n] -= 2

            addPieces = true

            if (b.n == 1024) {
                gameover()
            }
        }
    }

    if (addPieces) {
        addPiecesRateLimit()
    }

    if (draggingPoint) {
        draggingPoint.position.x += (pointer.x - draggingPoint.position.x) * kForceDrag
        draggingPoint.position.y += (pointer.y - draggingPoint.position.y) * kForceDrag
    }

    for (let n = 0; n < kNumIterations; ++n) {
        for (let c of constraints) {
            c.solve()
        }

        for (let b of bodies) {
            b.updateBoundingBox()
        }

        for (let i = 0; i < bodies.length - 1; ++i) {
            for (let j = i + 1; j < bodies.length; ++j) {
                if (findCollision(bodies[i] as unknown as XBody, bodies[j] as unknown as XBody)) {
                    resolveCollision(bodies[i] as unknown as XBody, bodies[j] as unknown as XBody, kFriction)
                }
            }
        }
    }

    for (let b of bodies) {
        b.paint(context)
    }

    if (draggingPoint) {
        context.beginPath()
        context.moveTo(draggingPoint.position.x, draggingPoint.position.y)
        context.lineTo(pointer.x, pointer.y)
        context.strokeStyle = '#FFD600'
        context.stroke()
    }

    requestAnimationFrame(mainloop)
}

function spawnLocation() {
    return (Math.random() * 0.3 + 0.35) * cwidth
}

const addPiecesRateLimit = debounce(function () {
    const has256 = count[256] || count[512] || count[1024]

    if (count[2]) {
        new Piece(scene, spawnLocation())
    }
    else if (count[4]) {
        new Piece(scene, spawnLocation(), -44, 4)
    }
    else if (has256) {
        if (count[8]) {
            new Piece(scene, spawnLocation(), -48, 8)
        }
        else {
            new Piece(scene, 0.35 * cwidth, -44, 4)
            new Piece(scene, 0.65 * cwidth, -44, 4)
        }
    }
    else {
        new Piece(scene, 0.35 * cwidth)
        new Piece(scene, 0.65 * cwidth)
    }
}, 300)

export let couch: Cushion | null = null
export let armrest0: Cushion | null = null
export let armrest1: Cushion | null = null

export function init() {
    Vertex.prototype.integrate = integrateVertex

    for (let n = 2; n <= 2048; n *= 2) {
        count[n] = 0
    }

    couch = new Cushion(scene, 280, 480, 400, 60)
    armrest0 = new Cushion(scene, 220, 420, 60, 120)
    armrest1 = new Cushion(scene, 680, 420, 60, 120)

    // @ts-ignore
    new Constraint(couch, couch.handle0, armrest0.handle0, false, 0.1)
    // @ts-ignore
    new Constraint(couch, couch.handle1, armrest1.handle1, false, 0.1)

    const y = cheight * 0.5

    new Piece(scene, 0.35 * cwidth, y)
    new Piece(scene, 0.65 * cwidth, y)
}
