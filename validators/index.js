exports.signupValidator = (req, res, next) =>{
    req.check('fullName')
        .notEmpty()
        .withMessage('Please enter your full name')
        .isLength({min: 5, max: 32})
        .withMessage('Name must be between 5 and 32 characters.')
    req.check('email')
       .notEmpty()
       .withMessage('Please enter your email.')
       .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
       .withMessage('Please enter a valid email.')
    req.check('password')
       .notEmpty()
       .withMessage('Please enter your password')
       .isAlphanumeric()
       .withMessage('Password must have numbers and alphabets.')

       const errors = req.validationErrors();
        if (errors) {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({ error: firstError });
        }
    next()
}

exports.signinValidator = (req,res,next) =>{
    req.check('email')
       .notEmpty()
       .withMessage('Please enter email.')
       .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
       .withMessage('Please enter a valid email.')
    
       req.check('password')
          .notEmpty()
          .withMessage('Please enter your password')
          .isAlphanumeric()
          .withMessage('Password must have numbers and alphabets.')
        
        const errors = req.validationErrors()
        if(errors){
            const firstError  = errors.map(error => error.msg)[0]
            return res.status(400).json({
                error: firstError
            })
        }
        next()
}

exports.contactInfoValidator = (req,res,next) =>{
    req.check('body')
       .notEmpty()
       .withMessage('Please write a message.')
       .isLength({min: 200})
       .withMessage('The message should be at least 200 characters in lentgh.')

       const errors = req.validationErrors()
        if(errors){
            const firstError  = errors.map(error => error.msg)[0]
            return res.status(400).json({
                error: firstError
            })
        }
        next()
}

exports.resetPasswordValidator = (req,res,next)=>{
    const {newPassword} = req.body
    req.check('newPassword')
        .notEmpty()
        .withMessage('Please provide new password.')
        .isLength({min:6})
        .withMessage('Password must have minimum 6 characters.')
        .isAlphanumeric()
        .withMessage('Password must have, only, numbers and alphabets.')
        .trim()

    req.check('confirmPassword')
        .equals(newPassword)
        .withMessage('Passowrds do not match.')
        .trim()
    
        const errors = req.validationErrors()
        if(errors){
            const firstError  = errors.map(error => error.msg)[0]
            return res.status(400).json({
                error: firstError
            })
        }
        next()
}