const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');


const createProduct = asyncHandler(async(req, res) => {
    try {
        const {
            title,
            slug,
            description,
            price,
            category,
            brand,
            quantity,
            images,
            color,
            ratings // An array of ratings, each containing 'star' and 'postedBy'
        } = req.body;
        const newProduct = await Product.create({
        title, slug, description, category, brand, quantity, images, color, ratings, price
        })
        res.json(newProduct);


        
       
    }
    catch (error) {
        throw new Error(error);
    }

})

const getProduct = asyncHandler(async (req, res) => {
    const{id} = req.params
    try {
        const findProduct = await Product.findById(id);
        res.json({ product : findProduct.id  });
    }
    catch (error) {
        throw new Error(error);
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        allProducts = await Product.find();
        res.json(allProducts);
    }
    catch (error) {
        throw new Error(error)
        
    }
})











module.exports = {createProduct, getProduct, getAllProducts};