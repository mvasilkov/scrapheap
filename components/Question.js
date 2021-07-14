import React from 'react'

export default class Question extends React.Component {
    render() {
        const { title, text } = this.props

        return (
            <React.Fragment>
                <h2>
                    {title}
                    <button type="button" className="delete-button" onClick={this.onDelete}>
                        ❌
                    </button>
                </h2>
                <p>{text}</p>
            </React.Fragment>
        )
    }

    onDelete = async () => {
        await fetch('/api/questions/' + this.props.objectid, {
            method: 'DELETE'
        })

        this.props.refresh()
    }
}
