define(["box2d-html5"], function(box2d) {
    function Wheel(physics, left, top, radius) {
        var def = new box2d.b2BodyDef()
        def.type = box2d.b2BodyType.b2_dynamicBody
        def.position.SetXY(left, top)

        var shape = new box2d.b2CircleShape(radius)

        var fixdef = new box2d.b2FixtureDef()
        fixdef.density = 0.9
        fixdef.friction = 0.9
        fixdef.restitution = 0.5
        fixdef.shape = shape

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.radius = radius
    }

    Wheel.prototype.render = function(canvas) {
        var pos = this.body.GetPosition(),
            rot = this.body.GetAngleRadians()

        canvas.save()

        canvas.translate(pos.x, pos.y)
        canvas.rotate(rot)
        canvas.translate(-pos.x, -pos.y)

        canvas.moveTo(pos.x - this.radius, pos.y)
        canvas.lineTo(pos.x + this.radius, pos.y)
        canvas.arc(pos.x, pos.y, this.radius, 0, Math.PI + Math.PI, true)

        canvas.restore()
    }

    return Wheel
})
