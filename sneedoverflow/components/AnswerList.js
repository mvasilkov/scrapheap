import React from 'react'

import Answer from './Answer'

export default class AnswerList extends React.Component {
    render() {
        const { answers, refresh } = this.props

        return (
            <ul className="answers">
                {answers.map(a => (
                    <li key={a.objectid}>
                        <Answer parentid={a.parentid} objectid={a.objectid} text={a.text}
                            onDelete={refresh} />
                    </li>
                ))}
            </ul>
        )
    }
}
