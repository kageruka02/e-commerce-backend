const ProductCategory = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');



const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await ProductCategory.create(req.body);
        res.status(201).json(newCategory);
    }
    catch (error) {
        throw new Error(error);
    }
})

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await ProductCategory.find(req.query);
        res.status(200).json(categories);
        
    }
    catch (error) {
        throw new Error(error);
    }
})

const getAcategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongoDbId(id);
        const category = await ProductCategory.findById(id)
        res.status(200).json(category);
        
    }
    catch (error) {
        throw new Error(error);
        
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedCategory = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        throw new Error(error);
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const deletedCategory = await ProductCategory.findByIdAndDelete(id);
        res.status(204).json(deletedCategory);
        
    }
    catch (error) {
        throw new Error(error);
    }
})
module.exports = {createCategory , getAllCategories, getAcategory, updateCategory, deleteCategory}