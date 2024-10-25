const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productCtrl'); 
const router = express.Router();
const {isAdmin, authMiddleWare} = require('../middlewares/authMiddleware')

router.post('/',authMiddleWare,isAdmin,  createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.patch("/:id",authMiddleWare,isAdmin,  updateProduct);
router.delete("/:id",authMiddleWare,isAdmin,  deleteProduct);



module.exports = router;