const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")

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
    const user = await User.findOne({ email });
    if (user && await user.isPasswordMatching(password)) {
       res.json({_id: user._id, 
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
           mobile: user.mobile,
           token: generateToken
       })
    }
    else {
        throw new Error("Invalid Credentials");
    }

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
    const getUser = await User.findOne({ _id : id });
    if (!getUser) {
        throw new Error("The user does not exist");
    }
    res.json(getUser);
})

// delete a single user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
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
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("the user do not exist")
        }
        const allowedUpdates = ['firstName', 'lastName', 'email', 'mobile']
        allowedUpdates.forEach(function (key) {
            if (req.body[key]) {
                console.log(key);
                user[key] = req.body[key];
            }
        })
        const updateUser = await user.save();
        res.json({updateUser})

    }
    catch (error) {
        throw new Error("failed to update");
    }
    
})

module.exports = {createUser, login, getAllUsers, getUser, deleteUser, updateUser};