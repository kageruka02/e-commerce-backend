const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: {
            type: Number,
            default: 1
        },
        color: String,
        price: {
            type: Number,
            required: true
        }
    }], 
    totalAfterDiscount: Number,
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

module.exports = mongoose.model("Cart", cartSchema);