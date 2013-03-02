define(["box2d-html5"], function(box2d) {
    function Boundary(physics, left, top, width, height) {
        var def = new box2d.b2BodyDef()
        def.position.SetXY(left, top)
        def.fixedRotation = true

        var shape = new box2d.b2PolygonShape()
        shape.SetAsBox(width / 2, height / 2)

        var fixdef = new box2d.b2FixtureDef()
        fixdef.restitution = 0.5
        fixdef.shape = shape

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.width = width
        this.height = height
    }

    Boundary.prototype.render = function(canvas) {
        var pos = this.body.GetPosition()

        canvas.rect(pos.x - this.width / 2, pos.y - this.height / 2, this.width, this.height)
    }

    return Boundary
})
