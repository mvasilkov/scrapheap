var express = require("express"),
    app = express()

app.disable("x-powered-by")

app.use(express.bodyParser())
app.use(express.static("public"))

app.post("/~", function (req, res) {
    var body = "hello, world"
    res.setHeader("Content-Type", "text/plain")
    res.setHeader("Content-Length", body.length)
    res.end(body)

    console.log("%j", req.files.image)
})

app.listen(3000)
