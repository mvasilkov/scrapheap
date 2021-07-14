import React from 'react'

export default class QuestionForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            text: '',
        }
    }

    render() {
        const { title, text } = this.state

        return (
            <form action="" onSubmit={this.onSubmit}>
                <p><input type="text" value={title} onChange={this.titleChanged} /></p>
                <p><textarea cols="40" rows="8" value={text} onChange={this.textChanged} /></p>
                <p><input type="submit" value="Save" /></p>
            </form>
        )
    }

    titleChanged = event => {
        this.setState({ title: event.target.value })
    }

    textChanged = event => {
        this.setState({ text: event.target.value })
    }

    onSubmit = async event => {
        event.preventDefault()

        const { title, text } = this.state
        if (!title || !text) return

        await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                text,
            })
        })

        this.props.refresh()

        this.setState({
            title: '',
            text: '',
        })
    }
}
