import React from 'react'

import gfm from 'gfm.macro'

class Hello extends React.Component {
    render() {
        return (
            <div style={{color: '#ff0080', backgroundColor: '#0080ff'}}>
                Hello!
            </div>
        )
    }
}

const a = gfm`
aaa
===
hello gfm

| Table | Fable |
| --- | --- |
| a | b |

<button>foo</button>
`

const b = gfm(`
bbb
===
hello gfm

| Table | Fable |
| --- | --- |
| a | b |

\`\`\`javascript
console.log(1)
\`\`\`

<Hello />
`, { unsafe: true })


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
