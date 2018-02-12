const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Ghost Registration app listening on 127.0.0.1:3000')
})

if (require.main === module) {
    app.listen(3000, '127.0.0.1', function () {
        console.log('Ghost Registration app listening on 127.0.0.1:3000')
    })
}
