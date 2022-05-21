const {Schema, model} = require('mongoose')

const paymentModel = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
})

module.exports = model('Payment', paymentModel)