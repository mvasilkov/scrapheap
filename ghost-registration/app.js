#!/usr/bin/env node

const fs = require('fs')
const toml = require('toml')

const options = toml.parse(fs.readFileSync(__dirname + '/options.toml', { encoding: 'utf8' }))

const express = require('express')
const app = express()

const recaptcha = new (require('express-recaptcha'))(options.recaptcha.site_key, options.recaptcha.secret_key)

const api = require('./ghost_api')

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
        console.info('*', email)
        register(email)
        res.redirect('/registration/done')
        return
    }
    res.redirect('/registration')
})

app.get('/', function (req, res) {
    res.type('txt')
    res.send(`Ghost registration app listening on ${options.app.host}:${options.app.port}`)
})

function auth() {
    const opt = options.ghost
    return api.auth(opt.api, opt.username, opt.password, opt.client_id, opt.client_secret)
}

function invite(access, email) {
    return api.invite(options.ghost.api, access, email, options.ghost.role_id)
}

function register(email) {
    auth()
    .then(function (res) {
        return invite(res.access_token, email)
    })
    .then(function () {
        console.info('*', email, 'success')
    })
    .catch(function () {
        console.error('*', email, 'disaster')
    })
}

if (require.main === module) {
    app.listen(options.app.port, options.app.host, function () {
        console.log(`Ghost registration app listening on ${options.app.host}:${options.app.port}`)
    })
}
else {
    module.exports.app = app
    module.exports.auth = auth
    module.exports.invite = invite
}
