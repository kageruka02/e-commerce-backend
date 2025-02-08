const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require('../config/refreshToken');
const  jwt  = require('jsonwebtoken');
const { sendEmail } = require('./emailController');
const crypto = require('crypto');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');


//create a user
const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, mobile, password, role } = req.body;
    if (!firstName || !lastName || !email || !mobile || !password) {
              return res.status(400).send("Missing required fields: tel, email, or address");
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
        const newUser =  await User.create({ firstName, lastName, email, mobile, password, role });
        res.status(201).json({ "firstName": newUser.firstName, "lastName": newUser.lastName, "email":newUser.email, "mobile": newUser.mobile})

    }
    else { 
        return res.status(409).send({ "message":"User already exists"});
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
       res.status(200).json({_id: user._id, 
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
           mobile: user.mobile,
           token: generateToken(user._id)
       })
    }
    else {
        res.status(400);
        throw new Error("Invalid Credentials");
    }

})

// handle refresh token
const handleRequestToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        res.status(400)
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.status(400)
        throw new Error("No refresh token present in db or not matched")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.id !== user.id) {
            res.status(401)
                   throw new Error("There is something wrong with refresh token");
            
         
        }
        const accessToken = generateToken(user?._id);
        res.status(200).json({accessToken})
    })
    
})

// log out functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        res.status(400);
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        })
        return res.status(404).json({ error: "Refresh token not found in the database" });
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
        const { _id } = req.user;
        validateMongoDbId(_id);
        const getUsers = await User.find();
        res.status(200).json({getUsers})

        
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
        res.status(404)
        throw new Error("The user does not exist");
    }
    res.status(200).json(getUser);
})

// delete a single user
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    const { id } = req.params;
    validateMongoDbId(id);
    
    
    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User deleted successfully",
            deletedUser
        });
    }
    catch (error) {
         throw new Error("internal server Error");
    }
    
})


// update a single  user

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const user = await User.findById(_id);
        if (!user) {
            res.status(404)
            throw new Error("the user do not exist")
        }
        const allowedUpdates = ['firstName', 'lastName', 'email', 'mobile']
        let isUpdated = false;
        allowedUpdates.forEach(function (key) {
            if (req.body[key]) {
                 if (req.body[key] !== user[key]) {
                isUpdated = true;
                user[key] = req.body[key];
            }
                
            }
           
        })
        
        if (isUpdated) {
            const updateUser = await user.save();
            console.log("where is exactly error");
        res.status(200).json({"firstName":updateUser.firstName, "lastName": updateUser.lastName, "email": updateUser.email, "mobile": updateUser.mobile}) 
        }
        else {
            res.status(400).json({ 'message': "nothing to update"})
        }
        

    }
    catch (error) {
        console.log(error);
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
        res.status(200).json({ "message": "user Blocked" });
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
        res.status(200).json({"message": "User unblocked"});
    }
    catch (error) {
        throw new Error(error);
    }
})
 
//the user changing his own password when he  knows the last one
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    try {
        const user = await User.findById(_id);
     if (!user) {
           return   res.status(404).json({ "message": "User not found" });
        }
    if (await user.isPasswordMatching(password)) {
      return res.status(400).json({"message" : "the password is not changing"})
    }

    if (password) {
        user.password = password;
        const updatedPasswordUser = await user.save();
        console.log(updatedPasswordUser);
        return res.status(200).json(updatedPasswordUser);
    }
    }
    catch (error) {
        throw new Error("Failed to update password", error);
    }
    
})

//generate password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404)
        throw new Error("User not found");
    }
    try {
        const token = await user.createPasswordResetToken();
        console.log(token);
        await user.save();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        
// Detect if the request is coming from Swagger UI
        const isSwagger = req.get("Referer") && req.get("Referer").includes("/api-docs");

// Set the reset link based on the environment
        const resetLink = isSwagger  ? `${baseUrl}/api-docs/#/User/put_api_user_reset_password__token_`  // Redirect to Swagger UI
    : `${baseUrl}/api/user/reset-password/${token}`; // Default reset link
       
        const resetUrl = `Hi, please follow this link to reset your password. This link is valid till 10 minutes for now, <a href='${resetLink}' >click Here</a>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot password link",
            html: resetUrl

        }
        sendEmail(data);
        res.json(token)
        
    }
    catch (error) {
        throw new Error(error);
    }
    
}) 

//reset password after the generated token
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt : Date.now()}
    })
    if (!user) {
        res.status(401)
        throw new Error(" Token expired, please try again later");
    }
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    res.status(200).json({ "firstName": user.firstName, "lastName": user.lastName, "email":user.email, "mobile": user.mobile});
    
})

// admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("logging in");
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') throw new Error("Not authorized");
    if (findAdmin && await findAdmin.isPasswordMatching(password)) {
        const refreshToken =  generateRefreshToken(findAdmin?._id);
        const updateUser = await User.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            SameSite: 'lax',
        })
       res.status(200).json({_id: findAdmin._id, 
            firstName: findAdmin.firstName,
            lastName: findAdmin.lastName,
            email: findAdmin.email,
           mobile: findAdmin.mobile,
           token: generateToken(findAdmin._id)
       })
    }
    else {
        res.status(401)
        throw new Error("Invalid Credentials");
    }

})

//get wishlist

const getWishlist = asyncHandler(async (req, res) => {
    try {
        console.log("hello")
        const { _id } = req.user;
        
        if (!_id) {
            res.status(401)
            throw new Error("There is no token attacked to the header")
        }
        const user = await User.findById(_id).populate('wishlist');
        res.status(200).json(user['wishlist']);
        
        
    }
    catch (error) {
        throw new Error(error)
    }
   

})

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address
        }, { new: true })
        res.status(200).json(updatedUser);
    }
    catch (error) {
        throw new Error(error)
    }
})
 
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = User.findById(_id);
        const products = [];
        //check if user already have product in cart
        const alreadyExistCart = await Cart.findOne({ "orderedBy": _id })
        for (let i = 0; i < cart.length; i++){
            let object = {};
            // console.log(cart);
            // console.log(typeof(cart[i].productId));
            object.product = cart[i].productId;
            
            object.color = cart[i].color;
           let getPriceAndCount = await Product.findById(cart[i].productId).select("price quantity").exec();

            if (getPriceAndCount.quantity < cart[i].count) {
                res.status(409)
            throw new Error("The quantity is not available");
            } else {
            object.count = cart[i].count;
            }
         
            object.price = getPriceAndCount.price;
            products.push(object);
        }
        if (alreadyExistCart) { // if already exists we update
            const usualProducts = alreadyExistCart.products;
            //  console.log(usualProducts);
            products.forEach((product) => {
                const contains = usualProducts.filter((p) => p.product.toString() === product.product.toString());
                if (contains.length === 0) { //add product which is not usually there
                    usualProducts.push(product);
                }
                else {//if the product is on the products we update
                    const index = usualProducts.findIndex((cartItem) => cartItem.product.toString() === product.product.toString());
                    usualProducts[index] = product; 
                    
                }
            })
            // console.log(usualProducts);
            const cartTotal = usualProducts.reduce((total, product) => total + (product.price * product.count), total = 0);
            console.log(cartTotal);
            const newCart =  await Cart.findOneAndUpdate({ "orderedBy": _id }, {
                products: usualProducts,
                cartTotal,
                totalAfterDiscount: cartTotal
            }, {new: true})
            res.status(200).json(newCart);

        }
        else { // it does not exist we create
               const cartTotal = products.reduce((total, product) => total + (product.price * product.count), total = 0);
        const newCart = await new Cart({
            products,
            cartTotal,
            totalAfterDiscount: cartTotal,
            "orderedBy": _id
            
        }).save();
        res.status(200).json(newCart);
        }
     
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
})

const getUserCart = asyncHandler(async(req, res) => {

    const { _id } = req.user;
    validateMongoDbId(_id);
    console.log(_id);
    try {
        const user =await   Cart.findOne({ "orderedBy": _id }).populate("products.product", "_id title price");
        res.status(200).json(user)
     }
    catch (error) {
        console.error(error);
        throw new Error(error)
    }
}) 

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findById(_id);
        const cart = await Cart.findOneAndDelete({ "orderedBy": _id });
         if (!cart) {
            return res.status(404).json({ message: "No cart found for this user" });
        }
        res.status(200).json(cart);
        
        
    }
    catch (error) {
        // console.log("good")
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    const validCoupon = await Coupon.findOne({name: coupon})
    if (!validCoupon)
    {
        res.status(404)
        throw new Error("Invalid Coupon")
    }
    const user = await User.findOne({ _id });
    const { cartTotal } = await Cart.findOne({ orderedBy: user._id }).populate("products.product");
    const totalAfterDiscount = (cartTotal - cartTotal * validCoupon.discount / 100).toFixed(2);
    const couponedCart = await Cart.findOneAndUpdate({ orderedBy: _id }, {
        totalAfterDiscount
    },{new: true}
    )
    res.status(200).json(couponedCart);
    



})

const createOrder = asyncHandler(async (req, res) => {
    const { COD } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
   
    try {
         if (!COD) {
        throw new Error('Create cash order failed')
         }
        const user = await User.findById(_id);
        const userCart = await Cart.findOne({ orderedBy: user._id });
        const finalAmount = userCart.totalAfterDiscount;
        
        const productLessThancart = await Promise.all(userCart.products.map(async(item) => {
            const isAvailable = await Product.findOne({ _id: item.product });
           
            if (isAvailable.quantity < item.count) {
                return ([item.product, isAvailable.quantity])
                
            }
            return null;
        }))
        const filteredProductLessThancart = productLessThancart.filter(item => item !== null);
        if (filteredProductLessThancart.length > 0) {
            const quantities = filteredProductLessThancart.join('\n');
            // console.log(quantities);
            res.status(409)
            throw new Error(`The remaining quantity is ${quantities}`)
        }
        const newOrder = await Order.create({
            products: userCart.products,
            paymentIntent: {
                  id: uuidv4(),
            method: "COD",
            amount: finalAmount,
            status: "Cash on Delivery",
            created: Date.now(),
            currency: "usd",
            },
            orderBy: user._id,
            orderStatus: "Cash on Delivery"
          
        })
        const update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: {quantity: -item.count, sold: +item.count }}
                }
            }
        })
        await Product.bulkWrite(update, {})
        res.status(200).json({
            message: "success"
        })

    }
    catch (error) {
        console.error(error)
        throw new Error(error);
    }
  


    
})

 //admin to get the list of all placed orders
const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
       
        const userOrders1 = await Order.find({ orderBy: _id })//.populate('products.product');
        const userOrders = await Order.find({ orderBy: _id }).populate('products.product', "title -_id");
       

        res.status(200).json(userOrders);
        
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }

})

const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
            const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    const findOrder = await Order.findByIdAndUpdate(id, {
        orderStatus: status, 
        paymentIntent: {
            status: status,
        }
    }, { new: true });
    res.status(200).json(findOrder)
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }

})



module.exports = {createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRequestToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus};