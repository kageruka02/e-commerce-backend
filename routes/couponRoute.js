const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controllers/couponCtrl');
const { authMiddleWare, isAdmin, isBlocked } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/', authMiddleWare, isBlocked ,isAdmin, createCoupon);
router.get('/', authMiddleWare, isBlocked ,isAdmin, getAllCoupons);
router.put('/:id', authMiddleWare, isBlocked ,isAdmin, updateCoupon);
router.delete('/:id', authMiddleWare, isBlocked ,isAdmin, deleteCoupon);


module.exports = router;
