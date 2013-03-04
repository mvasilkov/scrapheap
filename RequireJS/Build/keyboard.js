define(function() {
    var left = 0x25, right = 0x27, joint = null,
        state = { left: false, right: false }

    function update() {
        joint.EnableMotor(state.left != state.right)
        joint.SetMotorSpeed((state.right | 0) - (state.left | 0))
    }

    function keydown(event) {
        if (event.keyCode === left && !state.left) {
            state.left = true
            update()
        }
        else if (event.keyCode === right && !state.right) {
            state.right = true
            update()
        }
    }

    function keyup(event) {
        if (event.keyCode === left && state.left) {
            state.left = false
            update()
        }
        else if (event.keyCode === right && state.right) {
            state.right = false
            update()
        }
    }

    return {
        control: function(arg) {
            joint = arg
            joint.SetMaxMotorTorque(20)

            document.addEventListener("keydown", keydown, false)
            document.addEventListener("keyup", keyup, false)
        }
    }
})
