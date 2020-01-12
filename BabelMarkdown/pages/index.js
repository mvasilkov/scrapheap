import React from 'react'

import md from '../app/md.macro'

const a = md`
aaa
===
hello
`

const b = md(`
bbb
===
hello
`)

export default class extends React.Component {
    render() {
        return (
            <article>
                <p>React</p>
                {a}
                {b}
            </article>
        )
    }
}
