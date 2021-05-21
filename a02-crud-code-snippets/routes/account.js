'use strict'
const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController.js')

module.exports = router

router.get('/', accountController.login)

router.get('/login', accountController.login)
router.post('/login', accountController.loginPost)

router.get('/logout', accountController.logout)

router.get('/register', accountController.create)
router.post('/register', accountController.createPost)
