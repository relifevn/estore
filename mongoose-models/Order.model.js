const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const OrderSchema = new mongoose.Schema({
    customerId: ObjectId,
    totalPrice: Number,
    address: String,
    status: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const CustomerOrderStockSchema = new mongoose.Schema({
    stockId: ObjectId,
    amount: Number,
    orderId: ObjectId,

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = {
    OrderModel: mongoose.model('Order', OrderSchema, 'Order'),
    CustomerOrderStockModel: mongoose.model('CustomerOrderStock', CustomerOrderStockSchema, 'CustomerOrderStock'),
}
