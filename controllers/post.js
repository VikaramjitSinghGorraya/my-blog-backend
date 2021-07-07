const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')


exports.postById = (req, res, next, id) =>{
    Post.findById({_id: id}, (err, post)=>{
        
        if(err){
            return res.status(400).json({
                error: 'Could not find post.'
            })
        }
        req.post = post
        next()
    })
}
exports.createPost = (req,res) =>{
    var form = formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
           
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { photo, title, category, tags, body } = fields;
        
        if(!title || title.length<=0){
            return res.status(400).json({
                error: 'Please provide a title.'
            })
        }
        if(!category || category.length <=0){
            return res.status(400).json({
                error: 'Please select a category.'
            })
        }
        if(!tags || tags.length<=0){
            return res.status(400).json({
                error: 'Please select an appropriate tags.'
            })
        }
        if(!body || body.length <200){
            return res.status(400).json({
                error: 'Body should have atleast 200 characters.'
            })
        }

        Post.findOne({title: title}, (err, postExists)=>{
            if(postExists){
                return res.status(400).json({
                    error: 'Blog with this title already exists.'
                })
            }
        })

        let arrayOfTags = tags && tags.split(',')
        const post = new Post({
            title: title,
            category: category,
            body: body,
            postedBy: req.auth.id
        })

        arrayOfTags.forEach(element => {
            post.tags.push(element)
        })

        if(files.photo){
            if(files.photo.size > 10000000){
                return res.status(400).json({error: 'Photo sould be less than 1Mb.'})
            }
            post.photo.data =  fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        
        post.save((err,blog)=>{
            if(err){
                return res.status(400).json({
                    error: 'Could not post the blog. Try again, later.'
                })
            }
            res.status(200).json({
                slug: blog.slug
            })
        })
    })
}

exports.getPosts = (req,res)=>{
    
    Post.find({})
        .select('-photo')
        .populate('category', '_id, title')
        .populate('tags', '_id, title, slug')
        .populate('postedBy', '_id, name')
        .exec((err, posts)=>{
            if(err){
                console.log(err)
                return res.status(400).json({
                    error: err
                })
            }
            return res.status(200).json({
                posts: posts
            })
        })
}

exports.getPostBySlug = (req,res)=>{
    const {slug} = req.params
    Post.findOne({slug: slug})
        .select('-photo')
        .populate('category', '_id, title')
        .populate('tags', '_id, title, slug')
        .populate('postedBy', '_id, name')
        .exec((err, post)=>{
            if(err){
                return res.status(400).json({
                    error: 'Something went wrong...'
                })
            }
            var postArr = []
            postArr.push(post)
            return res.status(200).json({
                post: postArr
            })
        })
}

exports.getPostBySearch = (req,res) =>{
   
    const {searchTerm} = req.body
    
    Post.find({$or:[{title: {$regex: searchTerm, $options: 'i'}}, {body:{$regex: searchTerm, $options: 'i'}}]})
    .select('-photo')
    .populate('category', '_id, title')
    .populate('tags', '_id, title, slug')
    .populate('postedBy', '_id, name')
    .exec((err,posts)=>{
        if(posts.length > 0){
            return res.status(200).json({
                    posts: posts
            })
        }
        return res.status(400).json({
            error: 'Uh oh! Seems like there are no matching results'
        })
    })
}

exports.getPostsByUser = (req,res) =>{
    const {id} = req.params
    Post.find({postedBy: id})
        .select('-photo')
        .populate('category', '_id, title')
        .populate('tags', '_id, title, slug')
        .populate('postedBy', '_id, name')
        .exec((err,posts)=>{
            if(err){
                return res.status(400).json({
                    error: 'No posts found...'
                })
            }
            return res.status(200).json({
                posts: posts
            })
        })
}

exports.deletePost = (req,res) =>{
    const {id} = req.params

    Post.findByIdAndDelete({_id:id}, (err,deleted)=>{
        if(err){
            res.status(400).json({
                error: 'Could not delete post'
            })
        }
        res.status(200).json({
            message: 'Post Deleted.'
        })
    })
}

exports.updatePost = (req,res)=>{

    const {slug} = req.params
    var form = formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }
        
        const { photo, title, category, tags, body } = fields;
        
        if(!title || !title.length){
            
            return res.status(400).json({
                error: 'Please provide a title.'
            })
        }
        if(!category || category.length <=0){
            return res.status(400).json({
                error: 'Please select a category.'
            })
        }
        if(!tags || tags.length<=0){
            
            return res.status(400).json({
                error: 'Please select an appropriate tags.'
            })
        }
        if(!body || body.length <200){
            return res.status(400).json({
                error: 'Body should have atleast 200 characters.'
            })
        }

        
        Post.findOne({slug: slug}, (err,post)=>{

            if(err){
                return res.status(400).json({
                    error: 'Could not find post...'
                })
            }
            
            post.title = title
            post.category = category
            post.body = body
            post.tags = tags && tags.split(',')
          
            // arrayOfTags.forEach(element => {
            //    if (post.tags.includes(element)){
            //        return
            //    }else{
            //     post.tags.push(element)
            //    }            
            // })
            if(files.photo){
                if(files.photo.size > 10000000){
                    return res.status(400).json({error: 'Photo sould be less than 1Mb.'})
                }
                post.photo.data =  fs.readFileSync(files.photo.path)
                post.photo.contentType = files.photo.type
            }

            if(!files.photo){
                post.photo = null
            }

            post.save((err,blog)=>{
                if(err){
                    return res.status(400).json({
                        error: 'Could not update the blog. Try again, later.'
                    })
                }
                return res.status(200).json({
                    message: blog.slug
                })
            })
        })
    })
}

exports.getPhoto = (req,res)=>{
   
    if(req.post.photo.data){
        res.set('Content-Type', req.post.photo.contentType)
        return res.send(req.post.photo.data)
    }
     return null
}
