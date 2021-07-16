import React from 'react'
import { withRouter } from 'next/router'

import Question from '../../components/Question'

class Page extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            objectid: null,
            question: {},
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
        const response = await fetch('/api/questions/' + objectid)
        const question = await response.json()

        this.setState({ objectid, question })
    }

    render() {
        const { objectid, question: q } = this.state

        if (objectid == null) return null

        return (
            <Question objectid={objectid} title={q.title} text={q.text}
                onDelete={this.gotoStartPage} />
        )
    }

    gotoStartPage = () => {
        const { router } = this.props
        router.push('/')
    }
}

export default withRouter(Page)
