'use strict'

import React from 'react'
import { connect } from 'react-redux'

import { setMetronome } from '../reducers/metronome'

class Metronome extends React.Component {
    onChange = event => {
        this.props.setMetronome(event.target.checked)
    }

    render() {
        const { active } = this.props

        return (
            <div style={{ marginTop: 20 }}>
                Metronome <input type="checkbox" checked={active} onChange={this.onChange} />
            </div>
        )
    }
}

const stateToProps = state => ({
    active: state.metronome.active,
})

const dispatchToProps = dispatch => ({
    setMetronome: active => dispatch(setMetronome(active)),
})

export default connect(stateToProps, dispatchToProps)(Metronome)
