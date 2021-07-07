const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema
var slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const postSchema = new mongoose.Schema({
    photo:{
        data: Buffer,
        contentType:String,
    },
    title:{
        type: String,
        required: true,
        min:3,
        max:32
    },
    category:{
        type: ObjectId,
        ref: 'category',
        required: true
    },
    tags:[{type: ObjectId, ref: 'tag', required: true}],
    slug:{
        type: String,
        slug:'title'
    },
    body:{
        type: {},
        min:200,
        max:2000000,
        required: true,
        trim: true
    },
    postedBy:{
        type: ObjectId,
        ref: 'user'
    }
}, {timestamps: true})

module.exports = mongoose.model('post', postSchema)