const express = require('express');
const router = express.Router();
const { authMiddleWare, isAdmin, isBlocked } = require('../middlewares/authMiddleware');
const { createBlogCategory, updateBlogCategory, deleteBlogCategory, getAllBlogCategories, getBlogcategory } = require('../controllers/blogCatCtrl');





router.post('/', authMiddleWare,isBlocked ,isAdmin, createBlogCategory);
router.put('/:id', authMiddleWare,isBlocked ,isAdmin, updateBlogCategory);
router.delete('/:id', authMiddleWare,isBlocked ,isAdmin, deleteBlogCategory);
router.get('/', getAllBlogCategories);
router.get('/:id', getBlogcategory);






module.exports =  router;