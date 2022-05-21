const {Schema, model} = require('mongoose')

const miscellaneousModel = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
})

module.exports = model('Miscellaneous', miscellaneousModel)