const mongoose = require('mongoose')
var slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const tagSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim: true,
        min:3,
        max:32
    },
    slug:{
        type: String,
        slug:'title'
    }
},{timestamps: true})

module.exports = mongoose.model('tag', tagSchema)