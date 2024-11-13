const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getAcategory, getAllCategories } = require('../controllers/ProductCategory');




router.post('/', authMiddleWare, isAdmin, createCategory);
router.put('/:id', authMiddleWare, isAdmin, updateCategory);
router.delete('/:id', authMiddleWare, isAdmin, deleteCategory);
router.get('/', getAllCategories);
router.get('/:id', getAcategory);






module.exports =  router;