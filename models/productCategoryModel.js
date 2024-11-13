const mongoose = require('mongoose');

let categorySechema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true

    }
}, { timestamps: true })

module.exports = mongoose.model('PCategory', categorySechema);