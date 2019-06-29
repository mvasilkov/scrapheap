'use strict'

import React from 'react'

const blackHeight = 120
const blackWidth = 30
const whiteHeight = 200
const whiteWidth = 50

class Octave extends React.Component {
    static defaultProps = {
        index: 0,
    }

    render() {
        const { index } = this.props
        const blackNotes = ['C#', 'D#', null, 'F#', 'G#', 'A#']
        const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

        return (
            <div style={{
                height: whiteHeight,
                left: index * whiteWidth * 7,
                position: 'absolute',
                top: 0,
                width: whiteWidth * 7,
            }}>
                {whiteNotes.map((note, index) =>
                    <div key={note} style={{
                        backgroundColor: '#fafafa',
                        boxShadow: 'inset 0 0 0 1px #e6e6e6',
                        height: whiteHeight,
                        left: index * whiteWidth,
                        position: 'absolute',
                        top: 0,
                        width: whiteWidth,
                    }}></div>)}
                {blackNotes.map((note, index) => note &&
                    <div key={note} style={{
                        backgroundColor: '#202020',
                        height: blackHeight,
                        left: (index + 1) * whiteWidth - blackWidth * 0.5,
                        position: 'absolute',
                        top: 0,
                        width: blackWidth,
                    }}></div>)}
            </div>
        )
    }
}

export default class Keyboard extends React.Component {
    static defaultProps = {
        octaves: 4,
    }

    render() {
        const { octaves } = this.props

        return (
            <div style={{
                height: whiteHeight,
                position: 'relative',
                transform: 'scale(0.5)',
                transformOrigin: '0 0',
                width: octaves * whiteWidth * 7,
            }}>
                {Array(octaves).fill(0).map((_, index) =>
                    <Octave key={index} index={index} />)}
            </div>
        )
    }
}
