define(["box2d-html5"], function(box2d) {
    function Wheel(physics, left, top, radius) {
        var def = new box2d.b2BodyDef,
            fixdef = new box2d.b2FixtureDef

        def.type = box2d.b2BodyType.b2_dynamicBody
        def.position.Set(left, top)

        fixdef.density = 0.9
        fixdef.friction = 0.9
        fixdef.restitution = 0.5
        fixdef.shape = new box2d.b2CircleShape(radius)

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.radius = radius
    }

    Wheel.prototype.render = function(canvas) {
        var pos = this.body.GetPosition()

        canvas.save()

        canvas.translate(pos.x, pos.y)
        canvas.rotate(this.body.GetAngleRadians())
        canvas.translate(-pos.x, -pos.y)

        canvas.moveTo(pos.x - this.radius, pos.y)
        canvas.lineTo(pos.x + this.radius, pos.y)
        canvas.arc(pos.x, pos.y, this.radius, 0, Math.PI + Math.PI, true)

        canvas.restore()
    }

    return Wheel
})
