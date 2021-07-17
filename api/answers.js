'use strict'
const { ObjectId } = require('bson')

function answersApi(app, db) {
    // Get all answers
    app.get('/api/questions/:parentid/answers', (req, res) => {
        const { parentid } = req.params
        const answers = []
        for (let objectid of Object.keys(db.data.answers[parentid] ?? {})) {
            const a = Object.assign({}, db.data.answers[parentid][objectid],
                { parentid, objectid })
            answers.push(a)
        }
        res.json(answers)
    })

    // Create a new answer
    app.post('/api/questions/:parentid/answers', (req, res) => {
        const { parentid } = req.params
        const { text } = req.body
        if (!parentid || !text) {
            res.status(422)
            res.json('no')
            return
        }

        if (!db.data.answers[parentid]) {
            db.data.answers[parentid] = {}
        }

        const objectid = (new ObjectId).toHexString()
        db.data.answers[parentid][objectid] = {
            text,
        }
        db.write()

        res.json('ok')
    })

    // Delete an answer by ID
    app.delete('/api/questions/:parentid/answers/:objectid', (req, res) => {
        const { parentid, objectid } = req.params

        if (!db.data.answers[parentid] || !db.data.answers[parentid][objectid]) {
            res.status(404)
            res.json('no')
            return
        }

        delete db.data.answers[parentid][objectid]
        db.write()

        res.json('ok')
    })
}

module.exports = answersApi
