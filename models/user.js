const mongoose =  require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        minlength:5
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: Number,
        default:0
    },
    about:{
        type: String
    },
    photo:{
        data: Buffer,
        contentType:String
    }
}, {timestamps: true})

userSchema.pre('save',  function(next){
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(this.password, salt)
    this.password = hashedPassword
    next()
})

userSchema.methods.verifyPassword =  function(pass){
    return bcrypt.compareSync(pass, this.password)
}
module.exports = mongoose.model('user', userSchema)