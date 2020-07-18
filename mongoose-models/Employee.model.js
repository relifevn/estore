const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const EmployeeSchema = new mongoose.Schema({
    email: String,
    name: String,
    phoneNumber: String,
    password: String,
    address: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = {
    EmployeeModel: mongoose.model('Employee', EmployeeSchema, 'Employee'),
}
