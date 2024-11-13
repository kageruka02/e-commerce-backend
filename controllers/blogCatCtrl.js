const blogCategory = require('../models/blogCatModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');



const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await blogCategory.create(req.body);
        res.json(newCategory);
    }
    catch (error) {
        throw new Error(error);
    }
})

const getAllBlogCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await blogCategory.find(req.query);
        res.json(categories);
        
    }
    catch (error) {
        throw new Error(error);
    }
})

const getBlogcategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongoDbId(id);
        const category = await blogCategory.findById(id)
        res.json(category);
        
    }
    catch (error) {
        throw new Error(error);
        
    }
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedCategory = await blogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCategory);
    }
    catch (error) {
        throw new Error(error);
    }
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const deletedCategory = await blogCategory.findByIdAndDelete(id);
        res.json(deletedCategory);
        
    }
    catch (error) {
        throw new Error(error);
    }
})
module.exports = { createBlogCategory , getAllBlogCategories, getBlogcategory, updateBlogCategory,  deleteBlogCategory}