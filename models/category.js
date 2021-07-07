const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        max:32
    }
},{timestamps: true})

module.exports = mongoose.model('category', categorySchema)