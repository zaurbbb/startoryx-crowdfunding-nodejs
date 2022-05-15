const {Schema, model} = require('mongoose')

const rateSchema = new Schema({
    rate: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    project: {type: Schema.Types.ObjectId, ref: 'Project'},
    user : {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('Rate', rateSchema)