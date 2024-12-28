const express = require("express");
const { createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRequestToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controllers/userCtrl");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.post('/forgort-password-token', forgotPasswordToken);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleWare, userCart);
router.post('/cart/applyCoupon', authMiddleWare, applyCoupon);
router.post('/cart/cash-order', authMiddleWare, createOrder)
router.put('/reset-password/:token', resetPassword);
router.get('/allUsers', getAllUsers);
router.get('/refresh', handleRequestToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleWare, getWishlist);
router.get('/cart', authMiddleWare, getUserCart);
router.get('/order', authMiddleWare, getOrders)
router.get('/:id', authMiddleWare, isAdmin, getUser);


router.delete('/empty-cart', authMiddleWare, emptyCart);
router.delete('/:id', authMiddleWare, isAdmin, deleteUser);
router.patch('/edit-user', authMiddleWare, updateUser);
router.put('/password', authMiddleWare, updatePassword);
router.put('/address', authMiddleWare, saveAddress)
router.put('/order/update-order/:id', authMiddleWare,isAdmin, updateOrderStatus);
router.put('/block-user/:id', authMiddleWare, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleWare, isAdmin, unblockUser);




module.exports = router;