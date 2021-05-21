'use strict'

const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const mongoose = require('./config/mongoose')
const helmet = require('helmet')

const app = express()

app.use(helmet())

const port = 8000

// cookie settings for the session

const sessionOptions = {
  name: 'SNIPPETS_SESSIONID',
  secret: 'vm222cv',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'strict',
    httpOnly: true,
    signed: true,
    secure: false 
  }
}

app.use(session(sessionOptions))

// view engine setup

app.engine('hbs', hbs ({
  extname: 'hbs',
  defaultLayout: 'default'

}))
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, '/public')))



// connection to database 
mongoose().catch(err => {
  console.log('Error occurred while trying to connect to the database.')
  console.error(err)
  process.exit(1)
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

 app.use(function(req,res,next) {
  res.locals.session = req.session
  next()
}) 

// flash messages

 app.use(function(req,res,next) {
  if(req.session) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  next()
}) 

// routes

app.use('/', require('./routes/start.js'));
app.use('/', require('./routes/account.js'));
app.use('/', require('./routes/crud.js'));

// 400 error handler
app.use(function(err, req, res, next) {
  if (err.status === 400)
  {
    res.status(400).render('../views/errors/400')
  }
})

// 403 error handler
app.use(function(err, req, res, next) {
  if (err.status === 403)
  {
    res.status(403).render('../views/errors/403')
  }
})

// 404 error handler
app.use(function(err, req, res, next) {
  if (err.status === 404)
  {
    res.status(404).render('../views/errors/404')
  }
})

// 500 error handler
app.use(function(err, req, res, next) {
  if (err.status === 500)
  {
    res.status(500).render('../views/errors/500')
  }
})

app.listen(port, () => {
  console.log('App listening on port ' + port)
})
