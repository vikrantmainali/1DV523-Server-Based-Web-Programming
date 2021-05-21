'use strict'
const express = require('express')
const router = express.Router()
const controller = require('../controller/controller.js')

router.get('/', controller.getIssues)
router.post('/', controller.handleWebHook)

module.exports = router
