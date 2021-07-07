const Category = require('../models/category')

exports.addCategory = (req,res) =>{
    const {title} = req.body
    const category = new Category({
        title: title
    })

    category.save((err,category) =>{
        if(err){
            return res.status(400).json({
                error: 'Could not add category. Try again.'
            })
        }
        return res.status(200).json({
            message: 'Category added.'
        })
    })
}

exports.getCategories = (req,res) =>{
    Category.find()
            .select('-__v')
            .exec((err,categories) =>{
                if(err){
                    return res.status(400).json({
                        error: 'Could not load categories.'
                    })
                }
                return res.status(200).json({categories:categories})
            })
}