'use strict'

import { applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { appWithRedux } from 'next-redux'

import keyboard from '../reducers/keyboard'
import metronome from '../reducers/metronome'

const reducer = combineReducers({
    keyboard,
    metronome,
})

const enhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export default appWithRedux(reducer, enhancer)
