const express = require("express");
const { createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRequestToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart } = require("../controllers/userCtrl");
const { authMiddleWare, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.post('/forgort-password-token', forgotPasswordToken);
router.post('/admin-login', loginAdmin);
router.post('/cart',authMiddleWare , userCart);
router.put('/reset-password/:token', resetPassword);
router.get('/allUsers', getAllUsers);
router.get('/refresh', handleRequestToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleWare, getWishlist);
router.get('/:id', authMiddleWare, isAdmin, getUser);

router.delete('/:id',authMiddleWare, isAdmin,  deleteUser);
router.patch('/edit-user', authMiddleWare, updateUser);
router.put('/password', authMiddleWare, updatePassword);
router.put('/address',authMiddleWare,  saveAddress)
router.put('/block-user/:id', authMiddleWare, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleWare, isAdmin, unblockUser);




module.exports = router;