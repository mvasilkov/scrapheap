import { context } from './canvas.js'
import { draggingPoint, kFrictionGround, setDraggingPoint } from './main.js'
import { Vec2 } from './node_modules/natlib/Vec2.js'
import { Constraint } from './node_modules/natlib/verlet/Constraint.js'
import { Scene } from './node_modules/natlib/verlet/Scene.js'
import { Vertex } from './node_modules/natlib/verlet/Vertex.js'
import { pointer } from './pointer.js'

export abstract class Body {
    vertices: Vertex[]
    positions: Vec2[]
    constraints: Constraint[]
    edges: Constraint[]
    center: Vec2
    halfExtents: Vec2
    mass: number
    scene: Scene
    groundFriction: number

    constructor(scene: Scene, mass: number = 1) {
        this.scene = scene
        this.vertices = []
        this.positions = []
        this.constraints = []
        this.edges = []
        this.center = new Vec2
        this.halfExtents = new Vec2
        this.mass = mass
        this.groundFriction = kFrictionGround
    }

    boundingBox() {
        let xmin = 99999
        let ymin = 99999
        let xmax = -99999
        let ymax = -99999

        for (let p of this.positions) {
            if (p.x < xmin) xmin = p.x
            if (p.y < ymin) ymin = p.y
            if (p.x > xmax) xmax = p.x
            if (p.y > ymax) ymax = p.y
        }

        this.center.set((xmin + xmax) * 0.5, (ymin + ymax) * 0.5)
        this.halfExtents.set((xmax - xmin) * 0.5, (ymax - ymin) * 0.5)
    }

    intervalLeft: number
    intervalRight: number

    project(a: Vec2) {
        this.intervalLeft = 99999
        this.intervalRight = -99999

        for (let p of this.positions) {
            const product = p.dot(a)
            if (product < this.intervalLeft) this.intervalLeft = product
            if (product > this.intervalRight) this.intervalRight = product
        }
    }

    abstract paint(context: CanvasRenderingContext2D): void

    drag() {
        if (pointer.dragging && !draggingPoint &&
            context.isPointInPath(pointer.x, pointer.y)) {

            let minDistance = 99999

            for (let p of this.vertices) {
                const distance = p.position.distanceSquared(pointer) ** 0.5
                if (distance < minDistance) {
                    minDistance = distance
                    setDraggingPoint(p)
                }
            }
        }
    }
}
