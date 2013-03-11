define(["app/Boundary", "app/Traktor", "keyboard"], function(Boundary, Traktor, keyboard) {
    var boundaries = Array(), traktor = null

    function start(canvas, physics) {
        function addBoundary(left, top, width, height) {
            boundaries.push(new Boundary(physics, left, top, width, height))
        }

        var width = physics._width,
            height = physics._height

        addBoundary(0.5 * width, 0, width, 1)
        addBoundary(0.5 * width, height, width, 1)
        addBoundary(0, 0.5 * height, 1, height - 1)
        addBoundary(width, 0.5 * height, 1, height - 1)

        traktor = new Traktor(physics, 0.5 * width, 0.5 * height)

        keyboard.control(traktor.rspring.joint)
    }

    function render(canvas, upd) {
        // boundaries
        canvas.beginPath()

        boundaries.forEach(function(b) { b.render(canvas) })

        canvas.fillStyle = "rgba(128,255,0,0.5)"
        canvas.fill()

        canvas.strokeStyle = "rgb(128,255,0)"
        canvas.stroke()

        canvas.closePath()

        // traktor
        canvas.beginPath()

        traktor.render(canvas)

        canvas.fillStyle = "rgba(255,0,0,0.5)"
        canvas.fill()

        canvas.strokeStyle = "rgb(255,0,0)"
        canvas.stroke()

        canvas.closePath()

        // wheels
        canvas.beginPath()

        traktor.fwheel.render(canvas)
        traktor.rwheel.render(canvas)

        canvas.fillStyle = "rgba(0,128,255,0.5)"
        canvas.fill()

        canvas.strokeStyle = "rgb(0,128,255)"
        canvas.stroke()

        canvas.closePath()
    }

    return {
        start: start,
        render: render
    }
})
