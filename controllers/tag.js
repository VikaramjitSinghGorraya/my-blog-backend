const Tag = require('../models/tag')

exports.createAndGetTag = (req,res) =>{
    const {newTag} = req.body

    if(!newTag || !newTag.length){
        return res.status(400).json({
            error: 'Please enter a tag name.'
        })
    }

    Tag.findOne({title: newTag}, (err,tagExists)=>{
        if(tagExists){
            return res.status(400).json({
                error: 'Tag already exists.'
            })
        }
    Tag.findOne({slug: newTag}, (err, tagExists) =>{
        if(tagExists){
            return res.status(400).json({
                error: 'Tag already exists.'
            })
        }

        const tag = new Tag({
            title: newTag
        })
        tag.save((err,tag) =>{
            if(err){
                return res.status(400).json({
                    error: 'Could not add tag. Please, try again, later.'
                })
            }
            Tag.find({})
               .select('-__v')
               .sort({'createdAt': 'desc'})
               .exec((err, tags)=>{
                   res.status(200).json({
                       message: 'Tag added.',
                       tags: tags
                   })
               })
        })
    })
})    
}

exports.getTags = (req,res)=>{
    Tag.find({})
       .select('-__v')
       .sort({'createdAt': 'desc'})
       .exec((err,tags)=>{
           if(err){
               res.status(400).json({
                   error: 'Could not retrieve tags.'
               })
           }
           
           res.status(200).json({tags: tags})
       })
}