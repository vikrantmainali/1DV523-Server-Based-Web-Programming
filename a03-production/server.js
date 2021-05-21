'use strict'
const express = require('express')
const http = require('http')
const path = require('path')
const hbs = require('express-handlebars')
const socket = require('socket.io')
const router = require('./routes/routes.js')
const server = express()

const port = process.env.PORT || 3000
const httpServer = http.createServer(server)
const io = socket(httpServer)

// view engine setup
server.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'default'
}))
server.set('view engine', 'hbs')
server.use(express.static(path.join(__dirname, 'public')))

server.use(express.urlencoded({ extended: true }))
server.use(express.json())

server.use('/', router)

server.use('/', router, async (req, res) => {
  io.emit('webhook-event', res.locals.event)
  res.sendStatus(200)
})

io.on('connection', (socket) => {
  console.log(socket.id + ' connected!')

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected!')
  })
  socket.on('message', (data) => {
    console.log(socket.id + ' sent ' + data)
  })
})

httpServer.listen(port, () => console.log('Listening on port ' + port + ' NODE_ENV is set to ' + process.env.NODE_ENV))
