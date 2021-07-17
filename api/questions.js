'use strict'
const { ObjectId } = require('bson')

function questionsApi(app, db) {
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
            res.status(422)
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
        const { objectid } = req.params

        if (!db.data.questions[objectid]) {
            res.status(404)
            res.json('no')
            return
        }

        // FIXME: Delete all answers to this question first
        delete db.data.questions[objectid]
        db.write()

        res.json('ok')
    })
}

module.exports = questionsApi
