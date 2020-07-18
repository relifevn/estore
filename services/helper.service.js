
const {
    EmployeeModel,
    CategoryModel,
    StockModel,
    CustomerModel,
    AdminModel,
    OrderModel,
    CustomerOrderStockModel,
} = require('../mongoose-models')
const ObjectId = require('mongoose').Types.ObjectId

class HelperService {

    /**
     * @param {string} orderId 
     */
    static async getOrderDetail(orderId) {
        if (!ObjectId.isValid(orderId)) {
            return null
        }
        const order = await OrderModel.findOne({ _id: new ObjectId(orderId) })
        if (!order) {
            return null
        }
        const customerOrderStocks = await CustomerOrderStockModel.find({
            orderId: new ObjectId(orderId),
        })

        const customer = await CustomerModel.findOne({ _id: order.customerId })
        if (!customer) { return null }

        const stocks = await Promise.all(customerOrderStocks.map(async customerOrderStock => {
            return {
                stock: await StockModel.findOne({_id: customerOrderStock.stockId}),
                amount: customerOrderStock.amount,
            }
        }))

        return {
            customer,
            stocks,
            totalPrice: order.totalPrice || 0,
            address: order.address || '',
            status: order.status,
        }
    }

}

module.exports = {
    HelperService,
}