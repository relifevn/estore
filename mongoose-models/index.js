const Admin = require('./Admin.model')
const Employee = require('./Employee.model')
const Category = require('./Category.model')
const Stock = require('./Stock.model')
const Customer = require('./Customer.model')
const Order = require('./Order.model')

module.exports = {
    // Admin
    AdminModel: Admin.AdminModel,

    // Employee
    EmployeeModel: Employee.EmployeeModel,

    // Category
    CategoryModel: Category.CategoryModel,

    // Stock
    StockModel: Stock.StockModel,

    //Customer
    CustomerModel: Customer.CustomerModel,

    // Order
    OrderModel: Order.OrderModel,
    CustomerOrderStockModel: Order.CustomerOrderStockModel,

}
