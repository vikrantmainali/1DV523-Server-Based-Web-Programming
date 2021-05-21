'use strict'
const express = require('express')
const router = express.Router()
const crudController = require('../controllers/crudController.js')

module.exports = router

router.get('/', crudController.readSnippet)
router.get('/read', crudController.readSnippet)

router.get('/create', crudController.create)
router.post('/create', crudController.createPost)

router.get('/update/:id', crudController.update)
router.post('/updated/:id', crudController.updatePost)

router.post('/delete/:id', crudController.delete)
