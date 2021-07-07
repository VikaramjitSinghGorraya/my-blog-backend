const express =  require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const uri = process.env.ATLAS_URI
const port = process.env.PORT || 4000

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors({ origin: true, credentials: true}))

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryROutes = require('./routes/category')
const tagRoutes = require('./routes/tag')
const postRoutes = require('./routes/post')

mongoose.connect(uri,{useCreateIndex: true, useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connection established...'))

app.listen(port, () => console.log(`Listening to port number ${port}`))

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryROutes)
app.use('/api', tagRoutes)
app.use('/api', postRoutes)

app.use((req, res, next) =>{
        const error = new Error('Not Found')
        error.status = 404
        next(error)
})

app.use((error, req,res,next) =>{
        res.status(error.status || 500)
        res.json({
                error: error.message
        })
})