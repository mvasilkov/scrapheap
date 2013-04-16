var express = require("express"),
    mongodb = require("mongodb"),
    fs = require("fs"),
    app = express()

function reject(file) {
    return true
}

app.disable("x-powered-by")

app.use(express.bodyParser())
app.use(express.static("public"))

app.post("/~", function (req, res) {
    var file = req.files.image

    if (reject(file)) {
        res.json({ reject: true })
        fs.unlink(file.path)
        return
    }

    var id = new mongodb.ObjectID,
        path = "public/upload/" + id

    res.json({ redir: path })
    fs.rename(file.path, path)
})

app.listen(3000)
