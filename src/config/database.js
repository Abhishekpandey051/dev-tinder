const mongoose = require('mongoose')


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhiecccs:MinoBDCNKBATtVMM@dev-tinder.rksyilq.mongodb.net/devTinder")
}

module.exports = connectDB;

