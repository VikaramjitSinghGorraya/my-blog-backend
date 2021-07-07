const category = require('../models/category')
const {addCategory, getCategories} = require('../controllers/category')
const express = require('express')
const router = express.Router()

router.post('/addCategory', addCategory)
router.get('/getCategories', getCategories)

module.exports = router