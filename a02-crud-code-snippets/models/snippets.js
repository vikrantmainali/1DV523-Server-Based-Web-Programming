'use strict'

const mongoose = require('mongoose')

const schema = mongoose.Schema({
    username: {type: String},
    title: {type: String, required: true, minlength: 2, maxlength: 30},
    snippet: {type: String, required: true, minlength: 10, maxlength: 1000}
},
    {timestamps: true}
)

const snippets = mongoose.model('Snippets', schema)

module.exports = snippets