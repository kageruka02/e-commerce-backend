const express = require('express');
const router = express.Router();
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const { createBlogCategory, updateBlogCategory, deleteBlogCategory, getAllBlogCategories, getBlogcategory } = require('../controllers/blogCatCtrl');





router.post('/', authMiddleWare, isAdmin, createBlogCategory);
router.put('/:id', authMiddleWare, isAdmin, updateBlogCategory);
router.delete('/:id', authMiddleWare, isAdmin, deleteBlogCategory);
router.get('/', getAllBlogCategories);
router.get('/:id', getBlogcategory);






module.exports =  router;