if (typeof requestAnimationFrame === "undefined") {
    ["moz", "webkit", "ms"].some(function(p) {
        var fun = this[p + "RequestAnimationFrame"]
        if (typeof fun === "function") {
            return requestAnimationFrame = fun
        }
    }) || (requestAnimationFrame = function(fun) {
        return setTimeout(fun, 0)
    })
}

define(function() {
    return requestAnimationFrame
})
