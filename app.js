'use strict'
const express = require('express')
const next = require('next')
const { ObjectId } = require('bson')

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

    // Get all questions
    app.get('/api/questions', (req, res) => {
        const questions = []
        for (let objectid of Object.keys(db.data.questions)) {
            const q = Object.assign({}, db.data.questions[objectid], { objectid })
            questions.push(q)
        }
        res.json(questions)
    })

    // Create a new question
    app.post('/api/questions', (req, res) => {
        const { title, text } = req.body
        if (!title || !text) {
            res.json('no')
            return
        }

        const objectid = (new ObjectId).toHexString()
        db.data.questions[objectid] = {
            title,
            text,
        }
        db.write()

        res.json('ok')
    })

    // Get a question by ID
    app.get('/api/questions/:objectid', (req, res) => {
        const question = db.data.questions[req.params.objectid]
        res.json(question)
    })

    // Delete a question by ID
    app.delete('/api/questions/:objectid', (req, res) => {
        if (!db.data.questions[req.params.objectid]) {
            res.json('no')
            return
        }

        delete db.data.questions[req.params.objectid]
        db.write()

        res.json('ok')
    })

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
