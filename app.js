const express = require('express')
const { app: longpaste, run } = require('longpaste')
const next = require('next')

const dev = ['development', undefined].includes(process.env.NODE_ENV)
const nextApp = next({ dev })

nextApp.prepare().then(function () {
  const app = express()
  
  app.use('/longpaste', longpaste)

  app.get('/posts/:id', (req, res) => {
    return nextApp.render(req, res, '/single', { id: req.params.id })
  });

  app.get('*', nextApp.getRequestHandler())

  run(app)
});
