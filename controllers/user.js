const nodemailer = require("nodemailer")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const formidable = require('formidable')
const fs = require('fs')
const user = require('../models/user');
const mail =  process.env.NODEMAIL_MAIL
const password = process.env.NODEMAIL_PASSWORD

exports.userById = (req, res, next, id) =>{
    user.findById({_id:id}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found'
            })
        }
        req.profile = user
        next()
    })
}

exports.userProfile = (req, res) =>{
    user.findById({_id:req.auth.id}, (err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found.'
            })
        }
        const {_id, email, name, createdAt, about} = user
        return res.status(200).json({
            user: {_id,email,name, createdAt, about}
        })
    })
}

exports.userProfileById = (req, res) =>{
    user.findById({_id:req.profile._id}, (err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'User not found.'
            })
        }
       
        const {_id, email, name, createdAt, about} = user
        return res.status(200).json({
            user: {_id,email,name, createdAt, about}
        })
    })
}

exports.updateProfile = (req,res)=>{

    var form = formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }
        const { photo, name, about } = fields;
      
        if(!name || !name.length){
            return res.status(400).json({
                error: 'Please provide a name.'
            })
        }

        user.findOne({_id: req.auth.id}, (err,userInfo)=>{
            if(err){
                res.status(400).json({
                    error: 'Could not find post...'
                })
            }
            userInfo.name = name

            if(!about.length <=0){
                userInfo.about = about
            }
           
            if(files.photo){
                if(files.photo.size > 10000000){
                    return res.status(400).json({error: 'Photo sould be less than 1Mb.'})
                }
                userInfo.photo.data =  fs.readFileSync(files.photo.path)
                userInfo.photo.contentType = files.photo.type
            }

            if(!files.photo){
                userInfo.photo = null
            }

            userInfo.save((err,user)=>{
                if(err){
                    console.log(err)
                    return res.status(400).json({
                        error: 'Could not post the blog. Try again, later.'
                    })
                }
                res.status(200).json({
                    user: user,
                    message: 'Blog updated successfully.'
                })
            })
        })
    })
}

exports.contactEmail = async (req, res) =>{
   
    const {email,message} = req.body

    if(message.length <=200){
        return res.status(400).json({
            error: 'The message should have at least 200 characters.'
        })
    }

        const emailData = {
            to: `blogaramaa@gmail.com`,
            from: process.env.SENDMAIL_TO_BLOGRAMAA,
            subject: `User contact: ${email}`,
            html: `<p>${message}</p>`
        }
        
        try{
        const result =  await sgMail.send(emailData)
        if(result){
            return res.status(200).json({message: `Thanks for reaching out. I will contact you back at ${email}.`})}
        }
        catch(error){
            console.log(error)
        return res.status(400).json({error:'Could not send email. Please, try again later.'})
        }
    }

    // }
    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure:false,
    //     auth: {
    //         user: process.env.NODEMAIL_MAIL,
    //         pass: process.env.NODEMAIL_PASSWORD        
    //     }})
    
    
    //   const mailOptions = {
    //     from: `${email}`,
    //     to: process.env.NODEMAIL_MAIL,
    //     subject: `Customer contact: ${email}`,
    //     text: `${message}`,
    //   }

    // transporter.sendMail(mailOptions,(error, info) =>{
    //     if(error){
    //         return res.status(400).json({
    //             error: 'Could not send mail. Please try again, later.'
    //         })
    //     }
    //     return res.status(200).json({
    //         message: `Email Sent. We will contact you back at ${email}`
    //     })
    // });


exports.getPhoto = (req,res)=>{
    
    if(req.profile.photo.data){
        res.set('Content-Type', req.profile.photo.contentType)
        return res.status(200).send(req.profile.photo.data)
    }
     return false
}