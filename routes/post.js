const express = require('express')
const router = express.Router()
const {createPost, getPosts,getPostBySlug, getPostBySearch, postById, getPhoto, getPostsByUser, deletePost, updatePost} = require('../controllers/post')
const {userById} = require('../controllers/user')
const {requireSignin,isAuth} = require('../controllers/auth')

router.param('postId', postById)
router.param('userId', userById)

router.post('/createPost/:userId', requireSignin, isAuth, createPost)
router.get('/getPosts/', getPosts)
router.get('/getPost/:slug', getPostBySlug)
router.get('/:postId/getPhoto', getPhoto)
router.post('/getPostBySearch', getPostBySearch)
router.post('/getPostsByUser/:id', getPostsByUser)
router.post('/deletePost/:id', deletePost)
router.post('/updatePost/:slug',  updatePost)

module.exports = router