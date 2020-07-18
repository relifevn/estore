const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const CategorySchema = new mongoose.Schema({
    name: String,
    url: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = {
    CategoryModel: mongoose.model('Category', CategorySchema, 'Category'),
}
