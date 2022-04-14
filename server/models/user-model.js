const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: {type: String},
    googleId: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    phone: {type: String},
    age: {type: Number},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: {type: []},
})

module.exports = model('User', userSchema)