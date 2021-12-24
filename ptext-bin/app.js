const express = require('express')
const { app: longpaste, run } = require('longpaste')
const next = require('next')

const dev = ['development', undefined].includes(process.env.NODE_ENV)
const nextApp = next({ dev })

nextApp.prepare().then(function () {
  const app = express()
  const reserved = new Set(['write'])

  app.use('/longpaste', longpaste)

  app.get('/favicon.ico', (req, res) => res.status(204))

  app.get('/:id', (req, res, next) => {
    if (reserved.has(req.params.id)) return next()
    nextApp.render(req, res, '/single', { id: req.params.id })
  })

  app.get('*', nextApp.getRequestHandler())

  run(app)
})
