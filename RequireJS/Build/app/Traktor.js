define(["box2d-html5"], function(box2d) {
    function Traktor(physics, left, top) {
        var def = new box2d.b2BodyDef()
        def.type = box2d.b2BodyType.b2_dynamicBody
        def.position.SetXY(left, top)

        var shape = new box2d.b2PolygonShape()
        shape.SetAsBox(this.width / 2, this.height / 2)

        var fixdef = new box2d.b2FixtureDef()
        fixdef.density = 2.5
        fixdef.restitution = 0.5
        fixdef.shape = shape

        this.body = physics.CreateBody(def)
        this.body.CreateFixture(fixdef)

        this.body.ApplyAngularImpulse(8)
    }

    Traktor.prototype.width = 4
    Traktor.prototype.height = 2

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
