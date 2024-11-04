const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true

    },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    numLiked: {
        type: Number,
        default: 0
    },
    numDislikes: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: "https://www.dreamstime.com/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-image110423482"
    },
    author: {
        type: String,
        required: true
    },
}, {
     toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true
    },
   timestamps: true
}
   
)




module.exports = mongoose.model('Blog', blogSchema)