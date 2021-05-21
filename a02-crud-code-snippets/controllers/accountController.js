'use strict'

const accounts = require('../models/accounts.js')

const accountController = {}

module.exports = accountController

const setActiveUser = (session, user) => {
    if(user) {
        session.username = user.username,
        session.userId = user.id,
        session.loggedIn = true
    } else {
        delete session.username
        delete session.userId
        session.loggedIn = false
    }
}

accountController.login = (req, res) => {
    res.render('account/login')
}

accountController.loginPost = async (req, res) => {
    const user = await accounts.findOne({ username: req.body.username })
      .catch(err => {
        console.error(err)
      })
      if (user && await user.checkPassword(req.body.password)) {
        req.session.flash = {type: 'success', message: 'Logged in successfully!'}
        setActiveUser(req.session,user)
        console.log('Logged in as ' + req.session.username)
        res.redirect('/')
      }
      else {
        req.session.flash = {type: 'error', message: 'Login unsuccessful'}
        res.redirect('/login')
      }
    }

accountController.logout = async (req, res) => {
    if (req.session.userId) {
        setActiveUser(req.session, undefined)
        req.session.flash = {type: 'success', message: 'Logged out successfully'}
    }
    res.redirect('/') 
    delete req.session.flash
}

accountController.create = (req, res) => {
    res.render('account/register')
  }

accountController.createPost = async (req,res) => {     
    const account = await accounts.create ({
        username: req.body.username,
        password: req.body.password
    })
    .catch(err => {
        req.session.flash = {type: 'error', message: 'This username already exists, try logging in or creating a new account'}
        req.session.username = req.body.username
        res.redirect('/register')
    })
    if(account) {
        setActiveUser(req.session, account) 
        req.session.flash = {type: 'success', message: 'The account has been created successfully!'}
        res.redirect('./login')   
        }
    }

