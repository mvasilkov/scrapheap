define(["box2d-html5", "app/Wheel", "app/Spring"], function(box2d, Wheel, Spring) {
    function Traktor(physics, left, top) {
        var def = new box2d.b2BodyDef,
            fixdef = new box2d.b2FixtureDef,
            shape = new box2d.b2PolygonShape

        def.type = box2d.b2BodyType.b2_dynamicBody
        def.position.Set(left, top)

        fixdef.density = 2.5
        fixdef.restitution = 0.25
        fixdef.shape = shape

        shape.SetAsBox(0.5 * this.width, 0.5 * this.height)

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.fwheel = new Wheel(physics, left + 2.5, top + 1.5, 1)
        this.rwheel = new Wheel(physics, left - 2.5, top + 0.5, 2)

        this.fspring = new Spring(physics, this.body, this.fwheel.body)
        this.rspring = new Spring(physics, this.body, this.rwheel.body)
    }

    Traktor.prototype.width = 6
    Traktor.prototype.height = 3

    Traktor.prototype.render = function(canvas) {
        var pos = this.body.GetPosition()

        canvas.save()

        canvas.translate(pos.x, pos.y)
        canvas.rotate(this.body.GetAngleRadians())
        canvas.translate(-pos.x, -pos.y)

        canvas.rect(pos.x - 0.5 * this.width,
                    pos.y - 0.5 * this.height,
                    this.width,
                    this.height)

        canvas.restore()
    }

    return Traktor
})
