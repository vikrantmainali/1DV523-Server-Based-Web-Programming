'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, minLength: 3, maxLength: 16},
    password: {type: String, required: true, minLength: 6}
})

schema.pre('save', async function (next) {
    const hashedPass = await bcrypt.hash(this.password, 12)
    this.password = hashedPass
})

schema.methods.checkPassword = async function (typedPassword) {
    return bcrypt.compare(typedPassword,this.password)
}

const accounts = mongoose.model('Account',schema)

module.exports = accounts
