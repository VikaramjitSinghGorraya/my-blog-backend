const express = require('express')
const router = express.Router()
const {signup, signin, signout, preSignup, passwordLink, resetPssword, isAuth, requireSignin} = require('../controllers/auth')
const {signupValidator, signinValidator, resetPasswordValidator} = require('../validators')

router.post('/preSignup', signupValidator, preSignup)
router.post('/accountVerified/:token', signup)
router.post('/signin', signinValidator, signin)
router.post('/passwordLink',passwordLink)
router.post('/updatePassword/',resetPasswordValidator,resetPssword)
router.get('/signout', signout)
module.exports = router