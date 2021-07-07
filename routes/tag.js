const express = require('express')
const router = express.Router()
const {createAndGetTag,getTags} = require('../controllers/tag')

router.post('/createTag', createAndGetTag)
router.get('/getTags', getTags)

module.exports = router