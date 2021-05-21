'use strict'
const express = require('express')
const router = express.Router()
const startController = require('../controllers/startController.js')

router.get('/', startController.index)

module.exports = router
