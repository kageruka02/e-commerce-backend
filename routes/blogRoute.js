const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog } = require('../controllers/blogController');
const {isAdmin, authMiddleWare, isBlocked} = require('../middlewares/authMiddleware')
const router = express.Router();




router.post('/', authMiddleWare,isBlocked ,isAdmin, createBlog);
router.put('/likes', authMiddleWare,isBlocked ,likeBlog);
router.put('/dislikes', authMiddleWare,isBlocked ,dislikeBlog);
router.put('/:id', authMiddleWare,isBlocked , isAdmin,updateBlog);

router.get("/", getAllBlogs);
router.get("/:id", getBlog);
router.delete('/:id', authMiddleWare,isBlocked ,isAdmin, deleteBlog);








module.exports =  router;