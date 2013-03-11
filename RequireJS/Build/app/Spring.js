define(["box2d-html5"], function(box2d) {
    var pivot = new box2d.b2Vec2(0, 1)

    function Spring(physics, traktor, wheel) {
        var jointdef = new box2d.b2WheelJointDef

        jointdef.Initialize(traktor, wheel, wheel.GetPosition(), pivot)
        jointdef.frequencyHz = 1.1
        jointdef.dampingRatio = 0.9

        this.joint = physics.CreateJoint(jointdef)
    }

    return Spring
})
