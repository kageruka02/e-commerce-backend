const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authMiddleWare, isAdmin, isBlocked } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getAcategory, getAllCategories } = require('../controllers/ProductCategory');




router.post('/', authMiddleWare,isBlocked ,isAdmin, createCategory);
router.put('/:id', authMiddleWare,isBlocked ,isAdmin, updateCategory);
router.delete('/:id', authMiddleWare,isBlocked ,isAdmin, deleteCategory);
router.get('/', getAllCategories);
router.get('/:id', getAcategory);






module.exports =  router;