const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const LikesAndDislikes = require('../models/LikeandDislike');

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBody = filterPost(req.body);
        const blog = await Blog.create(newBody);
        res.json(blog);
        
    }
    catch (error) {
        throw new Error(error);
    }
    
})


const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const filteredUpdate = filterPost(req.body);
        console.log(filteredUpdate);
        const updatedBlog = await Blog.findByIdAndUpdate(id, filteredUpdate, { new: true });
        res.json(updatedBlog);
    }
    catch (error) {
        throw new Error(error);
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const blog = await Blog.findByIdAndUpdate(id, {
            $inc: {numViews : 1}

        }, {new: true})
        res.json(blog)
    }
    catch (error) {
        throw new Error(error);
    }
})

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const allBlogs = await Blog.find();
        res.json(allBlogs);
        
    }
    catch (error) {
        throw new Error(error);
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog)
    }
    catch (error) {
        throw new Error(error);
    }
})

const likeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
    const userId = req.user._id;
    validateMongoDbId(blogId);
    const blogLikedorDisliked = await LikesAndDislikes.findOne({ userId, blogId });
    if (blogLikedorDisliked) {
        
        if (!blogLikedorDisliked.status)  { // this means it was  initially disliked
            blogLikedorDisliked.status = true;
            await blogLikedorDisliked.save();
            
        }
        else if (blogLikedorDisliked.status){
            res.json({ "message": "The document is already liked" });
        }
        
    }
    else { // the blog is neither liked or disliked
        const newLike = await LikesAndDislikes.create({
            userId, blogId, status: true
        });
    }
        //updating the blog model
    const numLiked = await LikesAndDislikes.countDocuments({ blogId, status: true });
    const numDislikes = await LikesAndDislikes.countDocuments({ blogId, status: false });
    const blog = await Blog.findByIdAndUpdate(blogId, {numLiked: numLiked, numDislikes: numDislikes}, {new: true});
    res.json(blog)
    }
    catch (e) {
        throw new Error(error);
    }
   
    
})

const dislikeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user._id;
        validateMongoDbId(blogId);
        const blogLikedorDisliked = await LikesAndDislikes.findOne({ userId, blogId });
        if (blogLikedorDisliked) {
        
        if (blogLikedorDisliked.status)  { // this means it was  initially liked
            blogLikedorDisliked.status = false;
           await  blogLikedorDisliked.save();
        }
        else {
             res.json({ "message": "The document is already disliked" });
            }
        
        }
        else { // the blog is neither liked or disliked
        const newDislike = await LikesAndDislikes.create({
            userId, blogId, status: false
        });
        }
        const numLiked = await LikesAndDislikes.countDocuments({ blogId, status: true });
        const numDislikes = await LikesAndDislikes.countDocuments({ blogId, status: false });
        const blog = await Blog.findByIdAndUpdate(blogId, {numLiked: numLiked, numDislikes: numDislikes}, {new: true});
        
        res.json(blog);
    }
    catch (e) {
        throw new Error(error);
    }
        
    
})


module.exports = {createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog}













const filterPost = (newPost) => {
    
    const disallowed = ["numViews", "numLiked", "numDislikes"]
    disallowed.forEach((e) =>  delete newPost[e])
    return newPost
}






