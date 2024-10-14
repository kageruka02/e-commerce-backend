const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleWare = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            const user = await User.findById(decoded?.id);
            req.user = user; // this makes this available to other following middlewares

            next();
            
        }
        catch (error) {
            throw new Error("Not Authorized token expires, please login again");
        }
        
    }
    else {
        throw new Error(" There is no token attacked to header")
    }
})
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        throw new Error("You are not the admin");
    }
    else {
        next();
    }
})
module.exports = { authMiddleWare, isAdmin };
