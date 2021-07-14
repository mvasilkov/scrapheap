'use strict'
const express = require('express')
const { ObjectId } = require('bson')

async function run() {
    // Setting up the database
    const lowdb = await import('lowdb') // Pure ESM package can choke on a bucket of cocks
    const db = new lowdb.Low(new lowdb.JSONFile(__dirname + '/db.json'))
    await db.read()

    if (!db.data) { // No database file on disk
        db.data = {
            questions: {},
        }
    }

    // Setting up the web server
    const app = express()
    const port = process.env.PORT || 3000

    app.use(express.static('public'))
    app.use(express.json())

    app.get('/api/questions', (req, res) => {
        res.json(db.data.questions)
    })

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

    app.delete('/api/questions/:objectid', (req, res) => {
        if (!db.data.questions[req.params.objectid]) {
            res.json('no')
            return
        }

        delete db.data.questions[req.params.objectid]
        db.write()

        res.json('ok')
    })

    app.get('/api/questions/:objectid', (req, res) => {
      const item = db.data.questions[req.params.objectid]
      res.json(item)
    })

    app.listen(port, () => {
        console.log(`Sneed's Overflow app listening at http://localhost:${port}`)
    })
}

if (require.main === module) {
    run()
}
