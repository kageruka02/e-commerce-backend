const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addtoWishList, rating, logUploadedImg } = require('../controllers/productCtrl'); 
const router = express.Router();
const { isAdmin, authMiddleWare, isBlocked } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadimage');

router.post('/',authMiddleWare,isBlocked,isAdmin,createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.patch("/:id", authMiddleWare,isBlocked ,isAdmin, updateProduct);
router.put('/addToWishlist', authMiddleWare,isBlocked ,isAdmin, addtoWishList);
router.put('/rating', authMiddleWare,isBlocked, rating);
router.put('/upload/:id', authMiddleWare,isBlocked, isAdmin, uploadPhoto.array("images", 10), productImgResize, logUploadedImg  )
router.delete("/:id",authMiddleWare,isBlocked,isAdmin,  deleteProduct);



module.exports = router;