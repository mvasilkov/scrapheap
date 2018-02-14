#!/usr/bin/env node

const fs = require('fs')
const toml = require('toml')

const options = toml.parse(fs.readFileSync(__dirname + '/options.toml', { encoding: 'utf8' }))

const express = require('express')
const app = express()

const recaptcha = new (require('express-recaptcha'))(options.recaptcha.site_key, options.recaptcha.secret_key)

app.use('/registration/static', express.static(__dirname + '/static', { index: false }))

app.get('/registration', /* recaptcha.middleware.render, */ function (req, res) {
    res.sendFile(__dirname + '/static/index.html')
})

app.get('/registration/done', function (req, res) {
    res.sendFile(__dirname + '/static/done.html')
})

app.use('/registration', express.json())
app.use('/registration', express.urlencoded({ extended: true }))

app.post('/registration', recaptcha.middleware.verify, function (req, res) {
    const { email } = req.body
    if (email && req.recaptcha.error === null) {
        console.log('*', email)
        res.redirect('/registration/done')
        return
    }
    res.redirect('/registration')
})

app.get('/', function (req, res) {
    res.type('txt')
    res.send('Ghost registration app listening on 127.0.0.1:3000')
})

if (require.main === module) {
    app.listen(3000, '127.0.0.1', function () {
        console.log('Ghost registration app listening on 127.0.0.1:3000')
    })
}
