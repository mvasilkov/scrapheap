define(["box2d-html5", "requestAnimationFrame"], function(box2d, requestAnimationFrame) {
    var width = 960, height = 540, scale = 20,
        real_width = width / scale, real_height = height / scale,
        solver_velocity = 8, solver_position = 3,
        canvas = null, physics = null, last_update = 0

    function render() {
        requestAnimationFrame(render)

        var now = Date.now(), upd = 0.01 * (now - last_update)
        last_update = now

        physics.Step(upd, solver_velocity, solver_position)
    }

    function main() {
        canvas = document.getElementsByTagName("canvas")[0].getContext("2d")
        physics = new box2d.b2World(new box2d.b2Vec2(0, 0.25))

        last_update = Date.now()

        requestAnimationFrame(render)
    }

    return main
})
