import React from 'react'

export default class AnswerForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
        }
    }

    render() {
        const { text } = this.state

        return (
            <form action="" onSubmit={this.onSubmit}>
                <p><textarea cols="40" rows="8" value={text} onChange={this.textChanged} /></p>
                <p><input type="submit" value="Save" /></p>
            </form>
        )
    }

    textChanged = event => {
        this.setState({ text: event.target.value })
    }

    onSubmit = async event => {
        event.preventDefault()

        const { parentid } = this.props
        const { text } = this.state
        if (!parentid || !text) return

        await fetch(`/api/questions/${parentid}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
            })
        })

        this.props.onRequestSent()

        this.setState({
            text: '',
        })
    }
}
