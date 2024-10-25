const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");


const createProduct = asyncHandler(async(req, res) => {
    try {
        let {
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
        if (!slug) {
            slug = slugify(title);
        }
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


const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const allowed = isAllowed(req.body);
        allowed[updatedBy] = req.user?.id;
        const userFound = await Product.findByIdAndUpdate(id, allowed, {new: true}
        );
        res.json(userFound)
    }
    catch (error) {
        throw new Error(error);
        
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const userFound = await Product.findByIdAndDelete(id);
        res.json(userFound)
    }
    catch (error) {
        throw new Error(error);
        
    }
})

function isAllowed(body) {
    const disallowed = ['updatedBy', "updateHistory", 'createdAt'];
    const allowed = Object.keys(body);
    for (const key of allowed) {
        if (disallowed.includes(key)) {
            delete body[key];
        }
    }
    return body;
}













module.exports = {createProduct, getProduct, getAllProducts, updateProduct, deleteProduct};