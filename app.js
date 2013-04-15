var express = require("express"),
    app = express()

app.get("/hello.txt", function (req, res) {
    var body = "hello, world"
    res.setHeader("Content-Type", "text/plain")
    res.setHeader("Content-Length", body.length)
    res.end(body)
})

app.listen(3000)
