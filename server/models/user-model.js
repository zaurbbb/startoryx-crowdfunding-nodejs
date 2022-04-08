const {Schema, model} = require('mongoose')

const userSchema = new Schema({ // TODO: add required fields
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    first_name: {type: String},
    last_name: {type: String},
    phone: {type: String},
    age: {type: Number},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model('User', userSchema)