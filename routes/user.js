const user = require('../models/user')
const {userById, userProfile, contactEmail, updateProfile, getPhoto, userProfileById} = require('../controllers/user')
const {requireSignin, isAuth} = require('../controllers/auth')
const {contactInfoValidator} = require('../validators')
const express = require('express')
const router = express.Router()

router.param('userId', userById)
router.get('/getPhoto/:userId', getPhoto)
router.get('/:userId/profile', userProfileById)
router.get('/profileInfo', requireSignin, userProfile)
router.post('/contact/:userId', requireSignin, isAuth, contactEmail)
router.post('/updateProfile/:userId', requireSignin, isAuth, updateProfile)
module.exports = router

