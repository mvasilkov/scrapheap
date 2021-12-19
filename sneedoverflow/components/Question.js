import React from 'react'
import Link from 'next/link'

export default class Question extends React.Component {
    render() {
        const { objectid, title, text } = this.props

        return (
            <React.Fragment>
                <h2>
                    <Link href={`/questions/${objectid}`}>
                        <a>{title}</a>
                    </Link>
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

        this.props.onDelete()
    }
}
