const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: String,
        enum: ["Apple", "Samsung", "Lenovo"]
        
    },
    quantity: {
        min: [0, "Quantity cannot be negative"],
        type: Number,
        required: true,

    },
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    }, 
    color: {
        type: String,
        enum: ['Black', 'Brown', "Red"]
    },
    ratings: [{
        default: [],
        star: {
            type: Number,
            min: 1,
            max: 5,
        },
        postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }],
    updatedBy: {
        type: mongoose.SchemaTypes.ObjectId, ref: "User" 

    },
    updateHistory: [
        {
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            updatedAt: {
                type: Date,
                default: () => Date.now()
            },
            changes: {
                type: Map,
                of: {
                    old: mongoose.SchemaTypes.Mixed,
                    new: mongoose.SchemaTypes.Mixed
                }
                
                
            }
        }
    ]
}, { timestamps: true })
productSchema.pre('save', function (next) {
    product = this;
    if (!product.isNew) {
         changes = {};
    product.modifiedPaths().forEach((field) => {
        changes[field] =  {
            old: product.get(field, null, { getters: false }),
            new: product[field]
        }
    });
    if (Object.keys(changes).length > 0) {
        product.updateHistory.push({
            updateBy: product.updateBy,
            updatedAt: Date.now(),
            changes

        })
    }
        
    }
   
    next();
})
module.exports = mongoose.model("Product", productSchema )