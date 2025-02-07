const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleWare = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // id was the one put in jwt.sign
            // console.log(decoded);
            // console.log(token);
            const user = await User.findById(decoded?.id);
            req.user = user; // this makes this available to other following middlewares

            next();
            
        }
        catch (error) {
            res.status(401)
            console.log("Authorization header:", req.headers.authorization);
            throw new Error("Not Authorized token expires, please login again or is invalid");
        }
        
    }
    else {
        res.status(401)
        throw new Error(" There is no token attacked to header or  make sure you add Bearer before")
    }
})
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(401)
        throw new Error("You are not the admin");
    }
    else {
        next();
    }
})

const isBlocked = asyncHandler(async (req, res, next) => {
    if (req.user.isBlocked) {
        res.status(401)
    throw new Error("you have been temporarily Blocked");
    }
    else {
        next();
    }
    
})
module.exports = { authMiddleWare, isAdmin, isBlocked };
