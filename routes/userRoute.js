const express = require("express");
const { createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRequestToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controllers/userCtrl");
const { authMiddleWare, isAdmin, isBlocked } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', createUser);
router.post('/login',login);
router.post('/forgort-password-token', forgotPasswordToken);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleWare,isBlocked, userCart);
router.post('/cart/applyCoupon', authMiddleWare, isBlocked,isAdmin, applyCoupon);
router.post('/cart/cash-order', authMiddleWare, isBlocked,createOrder)
router.put('/reset-password/:token', resetPassword);
router.get('/allUsers',authMiddleWare,isBlocked,isAdmin,getAllUsers);
router.get('/refresh', handleRequestToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleWare, isBlocked,getWishlist);
router.get('/cart', authMiddleWare,isBlocked, getUserCart);
router.get('/myOrder', authMiddleWare,isBlocked ,getOrders)
router.get('/:id', authMiddleWare, isBlocked,isAdmin, getUser);


router.delete('/empty-cart', authMiddleWare,isBlocked, emptyCart);
router.delete('/:id', authMiddleWare, isBlocked, isAdmin,deleteUser);
router.patch('/edit-user', authMiddleWare, isBlocked,updateUser);
router.put('/password', authMiddleWare, isBlocked,updatePassword);
router.put('/address', authMiddleWare,isBlocked, saveAddress)
router.put('/order/update-order/:id', authMiddleWare,isBlocked,isAdmin, updateOrderStatus);
router.put('/block-user/:id', authMiddleWare, isBlocked,isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleWare, isBlocked,isAdmin, unblockUser);




module.exports = router;