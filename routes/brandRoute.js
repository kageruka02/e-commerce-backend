const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authMiddleWare, isAdmin, isBlocked } = require('../middlewares/authMiddleware');
const { createBrand, updateBrand, deleteBrand, getAllBrands, getBrand } = require('../controllers/brandCtrl');






router.post('/', authMiddleWare,isBlocked ,isAdmin, createBrand);
router.put('/:id', authMiddleWare,isBlocked ,isAdmin, updateBrand);
router.delete('/:id', authMiddleWare,isBlocked ,isAdmin, deleteBrand);
router.get('/', getAllBrands);
router.get('/:id', getBrand);






module.exports =  router;