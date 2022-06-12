const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    nickname: {type: String, unique: true, required: true},
    password: {type: String},
    googleId: {type: String},
    image: {type: String, default: "https://res.cloudinary.com/dluwizg51/image/upload/v1652250733/AVATARS/no-pic-ava_golenz.jpg"},
    first_name: {type: String},
    last_name: {type: String},
    phone: {type: String},
    age: {type: Number},
    specialist: {type: String},
    balance: {type: Number, default: 0},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    resetLink: {type: String},
    roles: {type: []},
})

module.exports = model('User', userSchema)