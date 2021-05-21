'use strict'

const mongoose = require('mongoose')

module.exports = function() {
    
    const uri = 'mongodb+srv://admin:password!@snippetdb.kd26a.mongodb.net/SnippetDB?retryWrites=true&w=majority'
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

    const db = mongoose.connection

    db.on('connected', () => console.log('Mongoose connection is on.'))
    db.on('error', err => console.log('Mongoose connection error occurred:  ' + err))
    db.on('disconnected', () => console.log('Mongoose connection is disconnected'))


    process.on('SIGINT', () => {
        db.close(() => {
            console.log('Mongoose connection is disconnected due to termination of the application.')
            process.exit(0)
        })
    })

return db
}