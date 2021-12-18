'use strict'

const initialState = {
    active: false,
}

export default function metronomeReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_METRONOME':
            const { active } = action
            return { active }
    }
    return state
}

export const setMetronome = active => ({ type: 'SET_METRONOME', active })
