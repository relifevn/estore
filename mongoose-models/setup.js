const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const db = {}

fs.readdirSync(__dirname)
    .filter(file => file.match(/\w*.model.js/i))
    .forEach(file => {
        const model = require(path.join(__dirname, file))
        db[model.modelName] = model
    })

db.mongoose = mongoose

db.mongoose.set('useFindAndModify', false)
db.mongoose.connect('mongodb+srv://thinh:thinh@cluster0.ssks9.gcp.mongodb.net/EStore', {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('error', function (err) {
    console.log('Mongoose: Could not connect to mongo server!', err)
    process.exit(1)
})

mongoose.connection.on('open', function (ref) {
    console.log('Mongoose: Connected to mongo server.')
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        // List all collection names
        // console.log(names)
    })
})

module.exports = db
