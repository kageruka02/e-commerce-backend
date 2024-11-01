const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        immutable: true
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
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
        
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
        required: true
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
                type: Object,
                of: {
                    old: mongoose.SchemaTypes.Mixed,
                    new: mongoose.SchemaTypes.Mixed
                }
                
                
            }
        }
    ]
}, { timestamps: true })
productSchema.pre('save', function (next) {
    const product = this;
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
productSchema.pre('findOneAndUpdate', async function (next) {
    const query = this;
    const updated = query.getUpdate() // this returns only the update ones and it is an object;
    console.log(updated);
    const oldProduct = await query.model.findOne(query.getQuery());
    let changes = {}

    if (Object.keys(updated).length > 0) {
        
        Object.keys(updated).forEach((field) => {
            const exclude = ["$set", "$setOnInsert", "updatedBy"]
            if (JSON.stringify(oldProduct[field]) !== JSON.stringify(updated[field]) && !exclude.includes(field)) {
                changes[field] = {
                    old: oldProduct[field],
                    new: updated[field]
                }
                
            }
        } )
        
         if (Object.keys(changes).length > 0) {
        await query.model.updateOne(query.getQuery(), {
            $push: {
                updateHistory: {
                    updatedAt: Date.now(),
                    updatedBy: updated['updatedBy'],
                    changes
                
            }
            }
        })
        
    }
    }
   
    next();
})
module.exports = mongoose.model("Product", productSchema )