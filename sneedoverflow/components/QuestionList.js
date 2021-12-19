import React from 'react'

import Question from './Question'

export default class QuestionList extends React.Component {
    render() {
        const { questions, refresh } = this.props

        return (
            <ul className="questions">
                {questions.map(q => (
                    <li key={q.objectid}>
                        <Question objectid={q.objectid} title={q.title} text={q.text}
                            onDelete={refresh} />
                    </li>
                ))}
            </ul>
        )
    }
}
