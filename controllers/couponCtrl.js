const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');


const createCoupon = asyncHandler(async (req, res) => {
    try {
        const { name, expiry, discount } = req.body;

        const newCoupon = await Coupon.create({name,
    expiry: new Date(expiry), discount});
        res.status(201).json(newCoupon);
    }
    catch (error) {
        throw new Error(error);
    }
})

const getAllCoupons = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
        
    }
    catch (error) {
        throw new Error(error);
    }
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updateCoupon)
    }
    catch (error) {
        throw new Error(error);
    }
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete( id );
        res.status(204).json(deleteCoupon
        )
    }
    catch (error) {
        throw new Error(error);
    }
})



    module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon};