#!/usr/bin/env node

const express = require('express')
const app = express()

app.use('/registration/static', express.static('static'))

app.get('/', function (req, res) {
    res.send('Ghost registration app listening on 127.0.0.1:3000')
})

if (require.main === module) {
    app.listen(3000, '127.0.0.1', function () {
        console.log('Ghost registration app listening on 127.0.0.1:3000')
    })
}
