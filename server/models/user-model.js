const {Schema, model} = require('mongoose')

const userSchema = new Schema({ // TODO: add required fields
    email: {type: String},
    password: {type: String},
    googleId: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    phone: {type: String},
    age: {type: Number},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', userSchema)