const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
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
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
    type: Array,
        default: [],
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordHistory: [{
        passwordChangedAt: Date,
        changed: {
            old: String,
            new: String,
        }
    }
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,


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
userSchema.methods.createPasswordResetToken = async function () {
    const user = this;
    return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
        
        if (err) return reject(err);

        const resetToken = buffer.toString("hex");
        user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 30 * 60 * 1000;// 10 minutes
        resolve (resetToken);
        })
        
    })
    
}
module.exports = mongoose.model("User", userSchema);