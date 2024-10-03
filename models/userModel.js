const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,   
    },
    lastName: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
    type: Array,
        default: [],
    },
    address: [{ type: ObjectId, ref: "Address" }],
    wishlist: [{type: ObjectId, ref: "Product"}],
}, { timestamps: true }) // this puts the createdAt and updatedtAt

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
    return next();  // If the password hasn't changed, move on
  }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.isPasswordMatching = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
module.exports = mongoose.model("User", userSchema);