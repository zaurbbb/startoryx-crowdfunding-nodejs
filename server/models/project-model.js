const domPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const htmlPurify = domPurify(new JSDOM().window)

const {Schema, model} = require('mongoose')

const projectSchema = new Schema({ // TODO: add required fields
    title: {type: String, required: true},
    image: {type: String, default: "https://res.cloudinary.com/dluwizg51/image/upload/v1651747098/PROJECTS/no_image_pp3wpw.png"},
    type: {type: String, required: true},
    shortly: {type: String, required: true}, // short description
    body: {type: String, required: true}, // detailed description
    user: {type: Schema.Types.ObjectId, ref: 'User'}, // creator
    dateCreated: {type: Date, default: Date.now},
    days: {type: Number, required: true}, // number of days before the end of the collection
    goal: {type: Number, default: 100},
    collected: {type: Number, default: 0},
    rates: [{type: Schema.Types.ObjectId, ref: 'Rate'}],
    avgRate: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    // Backers, Updates
})

projectSchema.index({name: 'text', 'title': 'text'})

projectSchema.pre('validate', function (next){
    if (this.body){
        this.body = htmlPurify.sanitize(this.body, {})
    }
    next()
})


module.exports = model('Project', projectSchema)