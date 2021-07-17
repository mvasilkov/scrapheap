import React from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'

import Question from '../../components/Question'
import AnswerForm from '../../components/AnswerForm'
import AnswerList from '../../components/AnswerList'

class Page extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            objectid: null,
            question: {},
            answers: [],
        }
    }

    componentDidMount() {
        const { objectid } = this.props.router.query

        if (objectid) this.load(objectid)
    }

    componentDidUpdate() {
        const { objectid } = this.props.router.query
        const loaded = !!this.state.objectid

        if (objectid && !loaded) {
            this.load(objectid)
        }
    }

    load = async objectid => {
        const responses = await Promise.all([
            fetch(`/api/questions/${objectid}`),
            fetch(`/api/questions/${objectid}/answers`),
        ])

        const [question, answers] = await Promise.all([
            responses[0].json(),
            responses[1].json(),
        ])

        this.setState({ objectid, question, answers })
    }

    refresh = async () => {
        const { objectid } = this.state
        if (!objectid) return

        const response = await fetch(`/api/questions/${objectid}/answers`)
        const answers = await response.json()

        this.setState({ answers })
    }

    render() {
        const { objectid, question: q, answers } = this.state

        if (objectid == null) return null

        return (
            <React.Fragment>
                <Head>
                    <title>{q.title} — Хорошие решения</title>
                </Head>
                <Question objectid={objectid} title={q.title} text={q.text}
                    onDelete={this.gotoStartPage} />
                <h2>Answers</h2>
                <AnswerForm parentid={objectid} onRequestSent={this.refresh} />
                <AnswerList answers={answers} refresh={this.refresh} />
            </React.Fragment>
        )
    }

    gotoStartPage = () => {
        const { router } = this.props
        router.push('/')
    }
}

export default withRouter(Page)
