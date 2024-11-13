const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const { createBrand, updateBrand, deleteBrand, getAllBrands, getBrand } = require('../controllers/brandCtrl');






router.post('/', authMiddleWare, isAdmin, createBrand);
router.put('/:id', authMiddleWare, isAdmin, updateBrand);
router.delete('/:id', authMiddleWare, isAdmin, deleteBrand);
router.get('/', getAllBrands);
router.get('/:id', getBrand);






module.exports =  router;