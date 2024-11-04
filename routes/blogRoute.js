const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog } = require('../controllers/blogController');
const {isAdmin, authMiddleWare} = require('../middlewares/authMiddleware')
const router = express.Router();




router.post('/', authMiddleWare, isAdmin, createBlog);
router.put('/likes', authMiddleWare, likeBlog);
router.put('/dislikes', authMiddleWare, dislikeBlog);
router.put('/:id', authMiddleWare, isAdmin, updateBlog);

router.get("/", getAllBlogs);
router.get("/:id", getBlog);
router.delete('/:id', authMiddleWare, isAdmin, deleteBlog);








module.exports =  router;