define(["box2d-html5", "app/Wheel", "app/Spring"], function(box2d, Wheel, Spring) {
    function Traktor(physics, left, top) {
        var def = new box2d.b2BodyDef()
        def.type = box2d.b2BodyType.b2_dynamicBody
        def.position.SetXY(left, top)

        var shape = new box2d.b2PolygonShape()
        shape.SetAsBox(this.width / 2, this.height / 2)

        var fixdef = new box2d.b2FixtureDef()
        fixdef.density = 2.5
        fixdef.restitution = 0.25
        fixdef.shape = shape

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.front_wheel = new Wheel(physics, left + 2.5, top + 1.5, 1)
        this.rear_wheel = new Wheel(physics, left - 2.5, top + 0.5, 2)

        this.front_spring = new Spring(physics, this.body, this.front_wheel.body)
        this.rear_spring = new Spring(physics, this.body, this.rear_wheel.body)
    }

    Traktor.prototype.width = 6
    Traktor.prototype.height = 3

    Traktor.prototype.render = function(canvas) {
        var pos = this.body.GetPosition(),
            rot = this.body.GetAngleRadians()

        canvas.save()

        canvas.translate(pos.x, pos.y)
        canvas.rotate(rot)
        canvas.translate(-pos.x, -pos.y)

        canvas.rect(pos.x - this.width / 2, pos.y - this.height / 2, this.width, this.height)

        canvas.restore()
    }

    return Traktor
})
