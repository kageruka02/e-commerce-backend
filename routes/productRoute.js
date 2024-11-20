const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addtoWishList, rating, logUploadedImg } = require('../controllers/productCtrl'); 
const router = express.Router();
const { isAdmin, authMiddleWare } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadimage');

router.post('/',authMiddleWare,isAdmin,  createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.patch("/:id", authMiddleWare, isAdmin, updateProduct);
router.put('/addToWishlist', authMiddleWare, isAdmin, addtoWishList);
router.put('/rating', authMiddleWare, rating);
router.put('/upload/:id', authMiddleWare, isAdmin, uploadPhoto.array("images", 10), productImgResize, logUploadedImg  )
router.delete("/:id",authMiddleWare,isAdmin,  deleteProduct);



module.exports = router;