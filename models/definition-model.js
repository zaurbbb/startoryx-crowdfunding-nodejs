const {Schema, model} = require('mongoose')

const definitionModel = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
})

module.exports = model('Definition', definitionModel)