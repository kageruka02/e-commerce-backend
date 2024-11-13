const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addtoWishList, rating } = require('../controllers/productCtrl'); 
const router = express.Router();
const {isAdmin, authMiddleWare} = require('../middlewares/authMiddleware')

router.post('/',authMiddleWare,isAdmin,  createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.patch("/:id", authMiddleWare, isAdmin, updateProduct);
router.put('/addToWishlist', authMiddleWare, isAdmin, addtoWishList);
router.put('/rating', authMiddleWare, rating);
router.delete("/:id",authMiddleWare,isAdmin,  deleteProduct);



module.exports = router;