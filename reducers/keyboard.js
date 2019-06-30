'use strict'

const KEYCODES = {
    /* Octave 0 */
    KeyQ: { octave: 0, note: 'C' },
    Digit2: { octave: 0, note: 'C#' },
    KeyW: { octave: 0, note: 'D' },
    Digit3: { octave: 0, note: 'D#' },
    KeyE: { octave: 0, note: 'E' },
    KeyR: { octave: 0, note: 'F' },
    Digit5: { octave: 0, note: 'F#' },
    KeyT: { octave: 0, note: 'G' },
    Digit6: { octave: 0, note: 'G#' },
    KeyY: { octave: 0, note: 'A' },
    Digit7: { octave: 0, note: 'A#' },
    KeyU: { octave: 0, note: 'B' },
    /* Octave 1 */
    KeyZ: { octave: 1, note: 'C' },
    KeyS: { octave: 1, note: 'C#' },
    KeyX: { octave: 1, note: 'D' },
    KeyD: { octave: 1, note: 'D#' },
    KeyC: { octave: 1, note: 'E' },
    KeyV: { octave: 1, note: 'F' },
    KeyG: { octave: 1, note: 'F#' },
    KeyB: { octave: 1, note: 'G' },
    KeyH: { octave: 1, note: 'G#' },
    KeyN: { octave: 1, note: 'A' },
    KeyJ: { octave: 1, note: 'A#' },
    KeyM: { octave: 1, note: 'B' },
}

function octave() {
    return {
        'C': false,
        'C#': false,
        'D': false,
        'D#': false,
        'E': false,
        'F': false,
        'F#': false,
        'G': false,
        'G#': false,
        'A': false,
        'A#': false,
        'B': false,
    }
}

const initialState = {
    controls: [octave(), octave(), octave(), octave()],
}

const copyControls = (octave, controls) => ([
    octave ? controls[0] : Object.assign({}, controls[0]),
    octave ? Object.assign({}, controls[1]) : controls[1],
])

const copyControls2 = (octave, controls) =>
    controls.map((a, index) => octave == index ? Object.assign({}, a) : a)

export default function keyboardReducer(state = initialState, action) {
    let a
    let keyDown = false
    let newControls

    switch (action.type) {
        case 'keydown':
            keyDown = true

        case 'keyup':
            if (a = KEYCODES[action.code]) {
                newControls = copyControls2(a.octave, state.controls)
                newControls[a.octave][a.note] = keyDown
                return Object.assign({}, state, { controls: newControls })
            }
            break

        case 'mousedown':
            keyDown = true

        case 'mouseup':
        case 'mouseout':
            if (state.controls[action.octave][action.note] !== keyDown) {
                newControls = copyControls2(action.octave, state.controls)
                newControls[action.octave][action.note] = keyDown
                return Object.assign({}, state, { controls: newControls })
            }
    }

    return state
}

export const updateControls = event => dispatch => {
    const { type, code } = event

    if (type == 'keydown') {
        if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
    }
    else if (type != 'keyup') {
        return
    }
    dispatch({ type, code })
}

export const updateControls2 = (type, octave, note) => dispatch => {
    if (Number.isInteger(octave) && note) dispatch({ type, octave, note })
}
