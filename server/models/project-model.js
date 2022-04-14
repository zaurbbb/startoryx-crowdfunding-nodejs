const {Schema, model} = require('mongoose')

const projectSchema = new Schema({
    title: {type: String, required: true},
    shortly: {type: String},
    body: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    dateCreated: {type: Date, default: Date.now},
    days: {type: Number},
    goal: {type: Number},
    collected: {type: Number},
    rate: {type: Number},
    // Backers, Comments, Updates
})

module.exports = model('Project', projectSchema)