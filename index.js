const http = require('http')
const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const ObjectId = require('mongoose').Types.ObjectId

const ORDER_STATUS = {
    ORDERED: 'ordered',
    RECEIVED: 'received',
}

require('./mongoose-models/setup')

const { CloudinaryService } = require('./services/cloudinary.service')
const { HelperService } = require('./services/helper.service')

app.use(express.static("public"))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json 
app.use(bodyParser.json())

// use cookie parser 
app.use(cookieParser())

app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
}))

const hostname = '127.0.0.1' // localhost
const port = process.env.PORT || 3000

// Render HTML
app.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'doantinhoc' })
})
app.get('/stocks', async (req, res) => {
    const id = req.query.id
    let stock = null
    if (id && ObjectId.isValid(id)) {
        stock = await StockModel.findOne({ _id: new ObjectId(id) }).lean()
    }
    res.render('stock-detail', {
        title: 'doantinhoc',
        stock: stock ? stock : {},
        isStockExisted: stock ? true : false,
    })
})
app.get('/single-product', (req, res) => {
    res.render('single-product', { title: 'doantinhoc' })
})
app.get('/Catagori', (req, res) => {
    res.render('Catagori', { title: 'doantinhoc' })
})
app.get('/product_list', (req, res) => {
    res.render('product_list', { title: 'doantinhoc' })
})
app.get('/about', (req, res) => {
    res.render('about', { title: 'doantinhoc' })
})
app.get('/', async (req, res) => {
    const categories = await CategoryModel.find({}).lean()
    const latestStocks = await StockModel.aggregate([
        {
            $sort: {
                createdAt: -1,
            }
        },
        {
            $limit: 6
        },
    ])
    res.render('index', { title: 'doantinhoc', categories, latestStocks })
})

app.get('/sign-in', (req, res) => {
    res.render('sign-in', { title: 'doantinhoc' })
})

app.get('/sign-up', (req, res) => {
    res.render('sign-up', { title: 'doantinhoc' })
})

app.get('/admin', (req, res) => {
    res.render('admin-dashboard', { title: 'doantinhoc' })
})
app.get('/employee', (req, res) => {
    res.render('employee', { title: 'doantinhoc' })
})
app.get('/product-checkin', (req, res) => {
    res.render('check-in', { title: 'doantinhoc' })
})
app.get('/oder', (req, res) => {
    res.render('oder', { title: 'doantinhoc' })
})
app.get('/add-stock', async (req, res) => {
    const categories = await CategoryModel.find({}).lean()
    res.render('add-stock', { title: 'doantinhoc', categories })
})
app.get('/employee-list', async (req, res) => {
    const categories = await CategoryModel.find({}).lean()
    let employees = await EmployeeModel.find({}).lean()
    res.render('employee-list', { title: 'doantinhoc', categories, employees })
})
app.get('/stocks-list', async (req, res) => {
    const categories = await CategoryModel.find({}).lean()
    let stocks = await StockModel.find({}).lean()
    stocks = stocks.map(stock => {
        const category = categories.find(cat =>
            new ObjectId(cat._id).equals(new ObjectId(stock.categoryId))
        )
        return {
            ...stock,
            categoryName: category.name,
        }
    })
    console.log(stocks)
    res.render('stocks-list', { title: 'doantinhoc', categories, stocks })
})
app.get('/add-employee', async (req, res) => {
    const categories = await CategoryModel.find({}).lean()
    let stocks = await StockModel.find({}).lean()
    stocks = stocks.map(stock => {
        const category = categories.find(cat =>
            new ObjectId(cat._id).equals(new ObjectId(stock.categoryId))
        )
        return {
            ...stock,
            categoryName: category.name,
        }
    })
    console.log(stocks)
    res.render('add-employee', { title: 'doantinhoc', categories, stocks })
})
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'doantinhoc' })
})

const {
    EmployeeModel,
    CategoryModel,
    StockModel,
    CustomerModel,
    AdminModel,
    OrderModel,
    CustomerOrderStockModel,
} = require('./mongoose-models')

// APIs

app.post('/api/sign-up', async (req, res) => {
    const { email, name, phoneNumber, password, address, type } = req.body

    if (type === 'customer') {
        const customer = await CustomerModel.create({
            email, name, phoneNumber, password, address
        })
        res.json(Object.assign({ type }, customer._doc))
        return
    }

    if (type === 'admin') {
        const admin = await AdminModel.create({
            email, name, phoneNumber, password, address
        })
        res.json(Object.assign({ type }, admin._doc))
        return
    }


})

app.post('/api/employees', async (req, res) => {
    const { email, name, phoneNumber, password, address } = req.body

    // Add into database
    const employee = await EmployeeModel.create({
        email, name, phoneNumber, password, address
    })

    res.json(employee)
})

app.post('/api/orders', async (req, res) => {
    const { customerId, stocks, totalPrice, address } = req.body

    // Todo: Check

    // Add into database
    const order = await OrderModel.create({
        customerId: new ObjectId(customerId),
        totalPrice,
        address,
        status: ORDER_STATUS.ORDERED,
    })

    console.log(order)

    const customerOrderStocks = await Promise.all(stocks.map(async stock => {
        return CustomerOrderStockModel.create({
            amount: stock.amount || 0,
            stockId: new ObjectId(stock.stockId),
            orderId: new ObjectId(order._id),
        })
    }))

    res.json(
        await HelperService.getOrderDetail(order._id)
    )
})


app.post('/api/sign-in', async (req, res) => {
    const { email, password, type } = req.body

    if (type === 'admin') {
        const admin = await AdminModel.findOne({
            email, password
        })
        if (admin) {
            res.json({
                isSuccess: true,
                user: Object.assign({ type }, admin._doc),
            })
        } else {
            res.json({
                isSuccess: false,
            })
        }
        return
    }

    if (type === 'employee') {
        const employee = await EmployeeModel.findOne({
            email, password
        })

        if (employee) {
            employee.set('type', type)
            res.json({
                isSuccess: true,
                user: Object.assign({ type }, employee._doc),
            })
        } else {
            res.json({
                isSuccess: false,
            })
        }
        return
    }

    if (type === 'customer') {
        const customer = await CustomerModel.findOne({
            email, password,
        })
        if (customer) {
            customer.set('type', type)
            res.json({
                isSuccess: true,
                user: Object.assign({ type }, customer._doc),
            })
        } else {
            res.json({
                isSuccess: false,
            })
        }
        return
    }

})

app.post('/api/stocks', async (req, res) => {
    const { name, categoryId, price, dealPrice, url, description } = req.body

    if (!ObjectId.isValid(categoryId)) {
        res.status(403).json({ error: { message: `Invalid categoryId ${categoryId}` } })
        return
    }
    const category = await CategoryModel.findOne({ _id: new ObjectId(categoryId) })
    if (!category) {
        res.status(403).json({ error: { message: `Invalid categoryId ${categoryId}` } })
        return
    }

    // Add into database
    const stock = await StockModel.create({
        name, categoryId, price, dealPrice, url, description
    })

    res.json(stock)
})

app.post('/api/categories',
    async (req, res, next) => {

        const { name } = req.body

        try {

            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({
                    message: 'No file was uploaded.',
                })
                return
            }

            const file = req.files.file
            if (Array.isArray(file)) {
                res.status(400).json({
                    message: 'Only 1 picture is allowed.',
                })
                return
            }

            // Upload to Cloudinary
            const cloudinaryFile = await CloudinaryService.uploadFile(
                `data:${file.mimetype};base64,${file.data.toString('base64')}`,
                'avatar'
            )

            const category = await CategoryModel.create({
                name,
                url: cloudinaryFile.url,
            })

            res.json(category)

        } catch (e) {
            console.warn('[ERROR] uploadImage', e)
        }

    }
)

app.post('/api/images',
    async (req, res, next) => {

        try {

            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({
                    message: 'No file was uploaded.',
                })
                return
            }

            const file = req.files.file
            if (Array.isArray(file)) {
                res.status(400).json({
                    message: 'Only 1 picture is allowed.',
                })
                return
            }

            console.log("Uploading to Cloudinary")

            // Upload to Cloudinary
            const cloudinaryFile = await CloudinaryService.uploadFile(
                `data:${file.mimetype};base64,${file.data.toString('base64')}`,
                'avatar'
            )

            console.log("Uploaded to Cloudinary. Done!")

            res.json(cloudinaryFile)

        } catch (e) {
            console.warn('[ERROR] uploadImage', e)
        }

    }
)

app.put('/api/categories',
    async (req, res, next) => {

        const { id, name } = req.body

        try {

            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({
                    message: 'No file was uploaded.',
                })
                return
            }

            if (!ObjectId.isValid(id)) {
                res.status(400).json({
                    message: 'Invalid category id.',
                })
                return
            }
            const category = await CategoryModel.findOne({
                _id: new ObjectId(id),
            })

            if (!category) {
                res.status(400).json({
                    message: 'Invalid category id.',
                })
                return
            }

            const file = req.files.file
            if (Array.isArray(file)) {
                res.status(400).json({
                    message: 'Only 1 picture is allowed.',
                })
                return
            }

            // Upload to Cloudinary
            const cloudinaryFile = await CloudinaryService.uploadFile(
                `data:${file.mimetype};base64,${file.data.toString('base64')}`,
                'avatar'
            )

            await CategoryModel.updateOne({
                _id: new ObjectId(id),
                name,
                url: cloudinaryFile.url,
            })

            const newCategory = await CategoryModel.findOne({
                _id: new ObjectId(id),
            })

            res.json(newCategory)

        } catch (e) {
            console.warn('[ERROR] uploadImage', e)
        }

    }
)

app.get('/api/categories',
    async (req, res, next) => {

        try {
            const categories = await CategoryModel.find({})
            res.json({ categories })
        } catch (e) {
            console.warn('[ERROR] categories', e)
        }

    }
)


app.listen(port)

console.log('Server is running on port ', port)