const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");
const User = require('../models/userModel');
const validateMongoDbId = require('../utils/validateMongodbId');
// const { all } = require('../routes/authRoute');


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
        title, slug, description, category, brand, quantity, images, color, ratings, price, createdBy : req.user.id 
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
        //filtering
        const queryObj = { ...req.query }
        console.log(queryObj);
        const excludeObjects = ["sort", "limit", "page", "fields"];
        excludeObjects.forEach((element) => delete queryObj[element]);
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(lt|lte|gt|gte)\b/g, (e) => `$${e}`);
        let query = Product.find(JSON.parse(queryString));
       

        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy); // sort what was found from find
            
        }
        else {
            query.sort('createdAt');
        }
        
        
        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                throw new Error("This page does not exist");
            }
        }
        console.log(page, limit, skip);
        query = await query;
        res.json(query)

    }
    catch (error) {
        throw new Error(error)
        
    }
})


const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const allowed = isAllowed(req.body);
        allowed.updatedBy = req.user?.id;
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
    const disallowed = ['updatedBy', "updateHistory", 'createdAt', 'totalratings'];
    const allowed = Object.keys(body);
    for (const key of allowed) {
        if (disallowed.includes(key)) {
            delete body[key];
        }
    }
    return body;
}

const addtoWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;
    validateMongoDbId(productId);
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === productId.toString());
        console.log(alreadyAdded);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: {wishlist: productId}
            }, { new: true })
            res.json(user);
        }
        else {
            console.log("okay");
            let user = await User.findByIdAndUpdate(_id, {
                $push: {wishlist:productId}
            }, { new: true })
            res.json(user);
        }

    }
    catch (error) {
        throw new Error(error);
    }

})

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId, comment } = req.body;
    try {
        const product = await Product.findById(productId);
    const alreadyRated = product.ratings.find((postRating) => postRating.postedBy.toString() === _id.toString());
    if (alreadyRated) {

        const updatedRating = await Product.updateOne({
            ratings: { $elemMatch: alreadyRated},
        },
            {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment
                 },
            }, { new: true })
   

        
    }
    else {
        const ratedProduct = await Product.findByIdAndUpdate(productId, {
            $push: {
                ratings: {
                    comment: comment,
                    star: star,
                    postedBy: _id
                }
            }
        }, { new: true }
        );
       
    }
    //update the whole ratings average
    const productRate = await Product.findById(productId);
    const totalRaters = productRate.ratings.length;
    const ratingSum = productRate.ratings.map((item) => item.star).reduce((total, a) => a + total, total = 0);
    const actualRating = Math.round(ratingSum / totalRaters);
    productRate.totalratings = actualRating.toString();
    const finalProduct = await productRate.save();
    res.json(finalProduct);
        
    }
    catch (error) {
        throw new Error(error);
    }
    

    
})












module.exports = {createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addtoWishList, rating};