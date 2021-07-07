const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const secret = process.env.JSON_SECRET
const mail =  process.env.NODEMAIL_MAIL
const password = process.env.NODEMAIL_PASSWORD
const expressjwt = require('express-jwt')


exports.preSignup =  (req, res) =>{
    const {fullName, email, password, confirmPassword} = req.body
    User.findOne({email: email},async (err, userExists) =>{
        if(userExists){
            return res.status(400).json({
                error: 'User with this email already exists.'
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                error: 'Confrim password does not match.'
            })
        }

        const token = jwt.sign({fullName, email, password}, process.env.JSON_VERIFICATION_SECRET, {expiresIn: '15min'})

        const emailData = {
            to: `${email}`,
            from: 'blogaramaa@gmail.com',
            subject: `VERIFICATION EMAIL`,
            html: `<p>Hello <b>${fullName}</b></p>
            <p>Here is your account activation link.</p>
            <p>See you soon !!! </p>

            <p>Copy the following link in the browser.</p>
            https://jovial-payne-9512ac.netlify.app/EmailVerification/${token}
    `
        }
        
       const result =  await sgMail.send(emailData)
        if(result){
            return res.status(200).json({message: `Thanks for reaching out. I will get back to you at ${email}`
        })}
        return res.status(400).json({error:'Could not send email. Please, try again later.'})
    })
}

    //     let transporter = nodemailer.createTransport({
    //         host: 'smtp.gmail.com',
    //         port: 465,
    //         secure: true,
    //         auth: {
    //             user: process.env.NODEMAIL_MAIL,
    //             pass: process.env.NODEMAIL_PASSWORD        
    //         },
    //         tls:{
    //             rejectUnauthorized:false
    //           }
    //     })
        
    //       const mailOptions = {
    //         from: 'blogaramaa@gmail.com',
    //         to: `${email}`,
    //         subject: `VERIFICATION EMAIL`,
    //         html: `<p>Hello <b>${fullName}</b></p>
    //                 <p>Here is your account activation link.</p>
    //                 <p>See you soon !!! </p>

    //                 <p>Copy the following link in the browser.</p>
    //                 http://localhost:3000/EmailVerification/${token}
    //         `,
    //       }
    
    //     transporter.sendMail(mailOptions,(error, info) =>{
    //         if(error){
    //             return res.status(400).json({
    //                 error: 'Could not send mail. Please, try again later.'
    //             })
    //         }
    //         return res.status(200).json({
    //             message: `Verification email sent to ${email}.
    //             Please, note that the link will be valid only for next 10 minutes.`
    //         })
    //     })
    // })



exports.signup = (req, res) =>{

   const token =  req.params.token
   
   if(token){
       jwt.verify(token, process.env.JSON_VERIFICATION_SECRET, function(err,decoded){
           if(err){
               return res.status(400).json({
                   error: 'Ummm... Link expired, please signup again.'
               })
           }
           const {fullName, email, password} = jwt.decode(token)
           const user = new User({
            name: fullName,
            email: email,
            password: password
        })
        user.save((err, user) =>{
            if(err){
                return res.status(400).json({
                    error: 'User could not be registered. Please try again later.'
                })
            }
            return res.status(200).json({
                message: 'User registered succesfully. Please Login.'
            })
        })
       })
   }      
}

exports.signin = (req,res) =>{
    
    const {email, password} = req.body
    User.findOne({email: email}, (err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: 'User does not exist.'
            })
        }
      const passwordVerified = user.verifyPassword(password)
      if(!passwordVerified){
        return res.status(400).json({
            error: 'Email or Password is incorrect.'
        })
      }
        const id = user._id
        const token = jwt.sign({id}, secret, {expiresIn: '1d'})
        res.cookie('token', token, {
            expiresIn  : 5184000000,
            httpOnly:true,
            secure: true,
            sameSite: 'none'
          })
        const {_id, email, name, about, createdAt} = user
        res.status(200).send({
            user:{_id,email, name, about, createdAt},
            message:'User logged in.'
        })
    })
}

exports.passwordLink = (req,res)=>{
    var token = ''
    var passwordResetLink = ''
    const {email, userId} = req.body
    User.findOne({email: email}, async (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'Could not find user.'
            })
        }

        const emailData = {
            to: `${email}`,
            from: 'blogaramaa@gmail.com',
            subject: `PASSWORD RESET LINK`,
            html: `<p>Hello <span style={{color:'#1877f2', fontWeight:'bold'}}>${user.name}</span></p>
                    <p>Here is your password reset link.</p>
                    <p>Copy the following link in the browser.</p>
                    ${userId ? `https://jovial-payne-9512ac.netlify.app/resetPassword/${userId}` : `https://jovial-payne-9512ac.netlify.app/ForgotPassword/${token}`}
        `}
        
       const result =  await sgMail.send(emailData)
        if(result){
            return res.status(200).json({message: `Thanks for reaching out. I will get back to you at ${email}`
        })}
        return res.status(400).json({error:'Could not send email. Please, try again later.'})
    })
}

    //     let transporter = nodemailer.createTransport({
    //         host: 'smtp.gmail.com',
    //         port: 587,
    //         secure:false,
    //         auth: {
    //             user: process.env.NODEMAIL_MAIL,
    //             pass: process.env.NODEMAIL_PASSWORD        
    //         }})

    //         if(!userId){
    //              token = jwt.sign({_id: user._id}, process.env.JSON_FORGOT_PASSWORD_SECRET,{expiresIn: '10m'})
    //         }

    //       const mailOptions = {
    //         from: 'blogaramaa@gmail.com',
    //         to: `${email}`,
    //         subject: `PASSWORD RESET LINK`,
    //         html: `<p>Hello <span style={{color:'#1877f2', fontWeight:'bold'}}>${user.name}</span></p>
    //                 <p>Here is your password reset link.</p>

    //                 <p>Copy the following link in the browser.</p>
    //                ${userId ? `https://localhost:3000/resetPassword/${userId}` : `https://localhost:3000/ForgotPassword/${token}`}
    //         `,
    //       }
    
    //     transporter.sendMail(mailOptions,(error, info) =>{
    //         if(error){
    //             console.log(error)
    //             return res.status(400).json({
    //                 error: 'Could not send mail. Please try again, later.'
    //             })
    //         }
    //         return res.status(200).json({
    //             message: `Password reset link sent to ${email}.
    //            Please, note that the link will be valid only for next 10 minutes.`
    //         })
    //     })
    // })

exports.signout = (req, res) =>{
    res.clearCookie('token')
    res.status(200).json({
        message:'Logout successful.'
    })
}

exports.resetPssword= (req,res)=>{
   
    const {token,id,newPassword} = req.body
    console.log(req.body)
   
    if(token){
        jwt.verify(token, process.env.JSON_FORGOT_PASSWORD_SECRET, function(err, decoded){
            if(err){
                return res.status(401).json({
                    error: 'Unauthorized'
                })
            }

            const {_id} = jwt.decode(token)
            userId = _id
        })}

        if(id){
            userId = id
        }

            User.findById({_id:userId}, (err,user)=>{
                if(err){
                    return res.status(400).json({
                        error: 'Could not find user.'
                    })
                }
                console.log(newPassword)
               user.password = newPassword

                user.save((err,userSaved)=>{
                    if(err){
    
                        return res.status(400).json({
                            error: 'Could not update password. Please, try again later.'
                        })
                    }

                    return res.status(200).json({
                        message: 'Password updated successfully.'
                    })
                })
            })
   
}

exports.requireSignin =  expressjwt({
    secret: process.env.JSON_SECRET,
    algorithms: ['HS256'],
    userProperty:'auth',
    getToken: function fromHeaderOrQueryString (req) {
            return req.cookies['token']
    }
})

exports.isAuth = (req,res,next)=>{
    let user = req.auth && req.profile && req.profile._id == req.auth.id
    if(!user){
        return res.status(401).json({
            error: 'Unauthorized access.'
        })
    }
    next()
}


    