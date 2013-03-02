define(["app/Boundary"], function(Boundary) {
    var boundaries = Array()

    function start(canvas, physics) {
        function addBoundary(left, top, width, height) {
            boundaries.push(new Boundary(physics, left, top, width, height))
        }

        var real_width = physics.real_width,
            real_height = physics.real_height

        addBoundary(real_width / 2, 0, real_width, 1)
        addBoundary(real_width / 2, real_height, real_width, 1)
        addBoundary(0, real_height / 2, 1, real_height - 1)
        addBoundary(real_width, real_height / 2, 1, real_height - 1)
    }

    function render(canvas, upd) {
        // boundaries
        canvas.beginPath()

        boundaries.forEach(function(b) { b.render(canvas) })

        canvas.fillStyle = "rgba(128, 255, 0, 0.5)"
        canvas.fill()

        canvas.strokeStyle = "rgb(128, 255, 0)"
        canvas.stroke()

        canvas.closePath()
    }

    return {
        start: start,
        render: render
    }
})
