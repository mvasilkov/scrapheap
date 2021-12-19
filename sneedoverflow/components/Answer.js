import React from 'react'

export default class Answer extends React.Component {
    render() {
        const { text } = this.props

        return (
            <React.Fragment>
                <p>
                    {text}
                    <button type="button" className="delete-button" onClick={this.onDelete}>
                        ❌
                    </button>
                </p>
            </React.Fragment>
        )
    }

    onDelete = async () => {
        const { parentid, objectid } = this.props

        await fetch(`/api/questions/${parentid}/answers/${objectid}`, {
            method: 'DELETE'
        })

        this.props.onDelete()
    }
}
