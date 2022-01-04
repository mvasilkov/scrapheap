var express = require("express"),
    mongodb = require("mongodb"),
    fs = require("fs"),
    app = express()

function reject(file) {
    switch (file.type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
            return false
    }
    return true
}

app.disable("x-powered-by")

app.use(express.limit("20mb"))
app.use(express.bodyParser())
app.use(express.static("public"))

app.put("/upload", function (req, res) {
    var file = req.files.image

    if (reject(file)) {
        res.json({ reject: true })
        fs.unlink(file.path)
        return
    }

    var id = new mongodb.ObjectID,
        type = file.type.replace("image/", "."),
        path = "public/upload/" + id + type

    res.json({ redir: path })
    fs.rename(file.path, path)
})

app.listen(3000)
