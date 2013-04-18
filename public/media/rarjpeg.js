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
            req.open("put", "/upload")
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
