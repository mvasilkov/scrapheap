'use strict'
const express = require('express')
const next = require('next')

const questionsApi = require('./api/questions')

async function run() {
    // Set up the database
    const lowdb = await import('lowdb') // Pure ESM package can choke on a bucket of cocks
    const db = new lowdb.Low(new lowdb.JSONFile(__dirname + '/db.json'))
    await db.read()

    if (!db.data) { // No database file on disk
        db.data = {
            questions: {},
        }
    }

    // Set up the web server
    const app = express()
    const port = parseInt(process.env.PORT, 10) || 3000
    const dev = process.env.NODE_ENV !== 'production'
    const nextapp = next({ dev })
    const handle = nextapp.getRequestHandler()

    await nextapp.prepare()

    app.use(express.json())

    // Set up the API
    questionsApi(app, db)

    // Any other route goes to Next.js
    app.all('*', (req, res) => {
        return handle(req, res)
    })

    app.listen(port, () => {
        console.log(`Sneed's Overflow app listening at http://localhost:${port}`)
    })
}

if (require.main === module) {
    run()
}
