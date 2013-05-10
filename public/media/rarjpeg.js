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
        paint = canvas.getContext && canvas.getContext("2d"),
        nib = backgroundColor("#fbfbfb"), ib = backgroundColor("#101010"),
        interactive = false, x = 0, y = 0, uploadCursor = new Image,
        UC_OFFSET_X = 509, UC_OFFSET_Y = 29

    uploadCursor.src = "/media/upload.png"

    function backgroundColor(value) {
        var test = new Image
        test.style.backgroundColor = value
        return test.style.backgroundColor
    }

    function onDragEnter(event) {
        interactive = true
        x = event.clientX
        y = event.clientY

        event.preventDefault()
    }

    function onDragOver(event) {
        x = event.clientX
        y = event.clientY

        event.preventDefault()
    }

    function onDragLeave(event) {
        interactive = false

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

        interactive = false

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

        var background = interactive? ib: nib

        if (canvas.style.backgroundColor != background) {
            canvas.style.backgroundColor = background
        }

        paint.clearRect(0, 0, canvas.width, canvas.height)

        if (interactive) {
            paint.drawImage(uploadCursor, x - UC_OFFSET_X, y - UC_OFFSET_Y)
        }
    }

    requestAnimationFrame(render)
})()
