define(["box2d-html5"], function(box2d) {
    function Boundary(physics, left, top, width, height) {
        var def = new box2d.b2BodyDef,
            fixdef = new box2d.b2FixtureDef,
            shape = new box2d.b2PolygonShape

        def.position.Set(left, top)
        def.fixedRotation = true

        fixdef.friction = 0.9
        fixdef.restitution = 0.5
        fixdef.shape = shape

        shape.SetAsBox(0.5 * width, 0.5 * height)

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.width = width
        this.height = height
    }

    Boundary.prototype.render = function(canvas) {
        var pos = this.body.GetPosition()

        canvas.rect(pos.x - 0.5 * this.width,
                    pos.y - 0.5 * this.height,
                    this.width,
                    this.height)
    }

    return Boundary
})
