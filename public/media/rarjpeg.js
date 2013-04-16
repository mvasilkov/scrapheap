(function () {
    var one = Array.prototype.shift.call.bind(Array.prototype.shift),
        canvas = one(document.getElementsByTagName("canvas"))

    function onDragOver(event) {
        event.preventDefault()
    }

    function onDrop(event) {
        var file = one(event.dataTransfer.files)

        if (file) {
            var formData = new FormData
            formData.append("image", file)

            var req = new XMLHttpRequest
            req.open("post", "/~")
            req.send(formData)
        }

        event.preventDefault()
    }

    canvas.addEventListener("dragover", onDragOver, false)
    canvas.addEventListener("drop", onDrop, false)

    function onResize(event) {
        canvas.width = innerWidth
        canvas.height = innerHeight
    }

    onResize()
    addEventListener("resize", onResize, false)
})()
