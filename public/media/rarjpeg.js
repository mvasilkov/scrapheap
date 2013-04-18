if (typeof requestAnimationFrame === "undefined") {
    ["moz", "webkit", "ms"].some(function (p) {
        var fun = this[p + "RequestAnimationFrame"]
        if (typeof fun === "function") {
            return (requestAnimationFrame = fun) && true
        }
    })
}

(function () {
    var one = Array.prototype.shift.call.bind(Array.prototype.shift),
        canvas = one(document.getElementsByTagName("canvas")),
        paint = canvas.getContext && canvas.getContext("2d")

    function onDragEnter(event) {
        event.preventDefault()
    }

    function onDragOver(event) {
        event.preventDefault()
    }

    function onDragLeave(event) {
        event.preventDefault()
    }

    function onDrop(event) {
        var file = one(event.dataTransfer.files)

        if (file) {
            var formData = new FormData
            formData.append("image", file)

            var req = new XMLHttpRequest
            req.open("put", "/upload")
            req.send(formData)
        }

        event.preventDefault()
    }

    canvas.addEventListener("dragenter", onDragEnter, false)
    canvas.addEventListener("dragover", onDragOver, false)
    canvas.addEventListener("dragleave", onDragLeave, false)
    canvas.addEventListener("drop", onDrop, false)

    function onResize(event) {
        canvas.width = innerWidth
        canvas.height = innerHeight
    }

    onResize()
    addEventListener("resize", onResize, false)

    function render() {
        requestAnimationFrame(render)

        paint.clearRect(0, 0, canvas.width, canvas.height)
    }

    requestAnimationFrame(render)
})()
