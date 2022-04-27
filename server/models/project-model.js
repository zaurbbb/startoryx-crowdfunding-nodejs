const domPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const htmlPurify = domPurify(new JSDOM().window)

const {Schema, model} = require('mongoose')



const projectSchema = new Schema({ // TODO: add required fields
    title: {type: String, required: true},
    image: {type: String, default: "https://images.thdstatic.com/productImages/27453014-e0f3-406c-98f4-2c217ef3bda8/svn/nuwallpaper-wallpaper-samples-pls4208sam-64_400.jpg"},
    type: {type: String},
    shortly: {type: String}, // short description
    body: {type: String}, // detailed description
    user: {type: Schema.Types.ObjectId, ref: 'User'}, // creator
    dateCreated: {type: Date, default: Date.now},
    days: {type: Number}, // number of days before the end of the collection
    goal: {type: Number},
    collected: {type: Number, default: 0},
    rate: {type: [], default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    // Backers, Updates
})

projectSchema.index({'title': 'text'})

projectSchema.pre('validate', function (next){
    if (this.body){
        this.body = htmlPurify.sanitize(this.body, {})
    }
    next()
})


module.exports = model('Project', projectSchema)