'use strict'

import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { updateControls, updateControls2, setSynth } from '../reducers/keyboard'
import { synths } from '../soundblaster/soundblaster'

const blackHeight = 120
const blackWidth = 30
const whiteHeight = 200
const whiteWidth = 50

const nop = event => event.preventDefault()

class Octave extends React.Component {
    static defaultProps = {
        index: 0,
        active: {},
    }

    render() {
        const { index, active, onClick } = this.props
        const blackNotes = ['C#', 'D#', null, 'F#', 'G#', 'A#']
        const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

        return (
            <div data-octave={index} style={{
                height: whiteHeight,
                left: index * whiteWidth * 7,
                position: 'absolute',
                top: 0,
                width: whiteWidth * 7,
            }} onMouseDown={onClick} onMouseUp={onClick} onMouseOut={onClick}>
                {whiteNotes.map((note, index) =>
                    <div key={note} data-note={note} style={{
                        backgroundColor: active[note] ? '#b2d7ff' : '#fafafa',
                        boxShadow: 'inset 0 0 0 1px #e6e6e6',
                        height: whiteHeight,
                        left: index * whiteWidth,
                        position: 'absolute',
                        top: 0,
                        width: whiteWidth,
                    }} onDragStart={nop}></div>)}
                {blackNotes.map((note, index) => note &&
                    <div key={note} data-note={note} style={{
                        backgroundColor: active[note] ? '#b2d7ff' : '#202020',
                        boxShadow: 'inset 0 0 0 1px #303030',
                        height: blackHeight,
                        left: (index + 1) * whiteWidth - blackWidth * 0.5,
                        position: 'absolute',
                        top: 0,
                        width: blackWidth,
                    }} onDragStart={nop}></div>)}
            </div>
        )
    }
}

class Keyboard extends React.Component {
    static defaultProps = {
        octaves: 4,
    }

    updateControls = event => {
        this.props.updateControls(event)
    }

    updateControls2 = event => {
        if (event.button) return
        const { note } = event.target.dataset
        const { octave } = event.target.parentElement.dataset
        this.props.updateControls2(event.type, +octave, note)
    }

    componentDidMount() {
        document.body.addEventListener('keydown', this.updateControls)
        document.body.addEventListener('keyup', this.updateControls)
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.updateControls)
        document.body.removeEventListener('keyup', this.updateControls)
    }

    setSynth = event => {
        this.props.setSynth(event.target.value)
    }

    render() {
        const { octaves, controls, synth } = this.props

        return (
            <Fragment>
                <div style={{
                    height: whiteHeight,
                    position: 'relative',
                    transform: 'scale(0.5)',
                    transformOrigin: '0 0',
                    width: octaves * whiteWidth * 7,
                }}>
                    {Array(octaves).fill(0).map((_, index) =>
                        <Octave key={index} index={index} active={controls[index]}
                            onClick={this.updateControls2} />)}
                </div>
                <select value={synth} onChange={this.setSynth}>
                    {synths.map(a =>
                        <option key={a.title} value={a.title}>{a.title}</option>)}
                </select>
            </Fragment>
        )
    }
}

const stateToProps = state => ({
    controls: state.keyboard.controls,
    synth: state.keyboard.synth,
})

const dispatchToProps = dispatch => ({
    updateControls: event => dispatch(updateControls(event)),
    updateControls2: (type, octave, note) =>
        dispatch(updateControls2(type, octave, note)),
    setSynth: synth => dispatch(setSynth(synth)),
})

export default connect(stateToProps, dispatchToProps)(Keyboard)
