const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require('../config/refreshToken');
const  jwt  = require('jsonwebtoken');

//create a user
const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;
    if (!firstName || !lastName || !email || !mobile || !password) {
              return res.status(400).send("Missing required fields: tel, email, or address");
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
        const newUser =  await User.create({ firstName, lastName, email, mobile, password });
        res.json(newUser)

    }
    else { 
        throw new Error("User Already Exists");
    }
})
// login a user
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("logging in");
    const user = await User.findOne({ email });
    if (user && await user.isPasswordMatching(password)) {
        const refreshToken =  generateRefreshToken(user?._id);
        const updateUser = await User.findByIdAndUpdate(user._id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            SameSite: 'lax',
        })
       res.json({_id: user._id, 
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
           mobile: user.mobile,
           token: generateToken(user._id)
       })
    }
    else {
        throw new Error("Invalid Credentials");
    }

})

// handle refresh token
const handleRequestToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        throw new Error("No refresh token present in db or not matched")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.id !== user.id) {
            
                   throw new Error("There is something wrong with refresh token");
            
         
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken})
    })
    
})

// log out functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        })
        return res.sendStatus(204) // forbidden
    }
    user.refreshToken = '';
    await user.save();
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204);

})

// get all users
const getAllUsers = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find();
        res.json({getUsers})

        
    }
    catch (error) {
        throw new Error(error);
    }
})

// get a single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    const getUser = await User.findOne({ _id : id });
    if (!getUser) {
        throw new Error("The user does not exist");
    }
    res.json(getUser);
})

// delete a single user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    
    
    try {
        const deleteUser = await User.deleteOne({ _id: id });
        res.json({ deleteUser });
    }
    catch (error) {
         throw new Error("The user does not exist");
    }
    
})


// update a single  user

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("the user do not exist")
        }
        const allowedUpdates = ['firstName', 'lastName', 'email', 'mobile']
        let isUpdated = false;
        allowedUpdates.forEach(function (key) {
            if (req.body[key] !== user[key]) {
                isUpdated = true;
                // console.log(key);
                user[key] = req.body[key];
            }
        })
        if (isUpdated) {
            const updateUser = await user.save();
        res.json({updateUser}) 
        }
        else {
            res.json({ 'message': "nothing to update"})
        }
        

    }
    catch (error) {
        throw new Error("failed to update");
    }
    
})

// block a single user
const blockUser = asyncHandler(async (req, res) => { 
    const id = req.params.id;
    validateMongoDbId(id);
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("the user do not exist")
        }
        user["isBlocked"] = true;
        user.save();
        res.json({ "message": "user Blocked" });
    }
    catch (error) {
        throw new Error(error);
    }
});
 

// unblock a single user
const unblockUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongoDbId(id)
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("the user do not exist")
        }
        user["isBlocked"] = false;
        user.save();
        res.json({"message": "User unblocked"});
    }
    catch (error) {
        throw new Error(error);
    }
})
 

module.exports = {createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRequestToken, logout};