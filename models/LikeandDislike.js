const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogId: {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    status: { // true for like and false for dislike
        type: Boolean,
        required: true,
    } 
}, { timestamps: true })

likeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

module.exports = mongoose.model('LikesAndDislikes', likeSchema);
