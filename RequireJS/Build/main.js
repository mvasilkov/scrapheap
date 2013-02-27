define(["box2d-html5"], function(box2d) {
    var width = 960, height = 540, scale = 20,
        real_width = width / scale, real_height = height / scale,
        canvas = null, physics = null

    function main() {
        canvas = document.getElementsByTagName("canvas")[0].getContext("2d")
        physics = new box2d.b2World(new box2d.b2Vec2(0, 0.25))
    }

    return main
})
