const mongoose = require('mongoose');
// Declare the Schema of the Mongo Model
 
const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    expiry: {
        type: Date,
        required: true
    },
    discount: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Coupon", couponSchema);