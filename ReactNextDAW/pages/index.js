'use strict'

import React, { Fragment } from 'react'

import Keyboard from '../components/keyboard'
import Metronome from '../components/metronome'

export default class StartPage extends React.Component {
    render() {
        return (
            <Fragment>
                <Keyboard />
                <Metronome />
            </Fragment>
        )
    }
}
