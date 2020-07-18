const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

module.exports = {

    _id: String | ObjectId,

    _created_at: {
        type: Date,
        default: Date.now
    },

    _updated_at: {
        type: Date,
    },

}