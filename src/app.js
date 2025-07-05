const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Virat",
        lastName: "Kohali",
        emailId: "virat@kohali.com",
        age: 50,
        password: "Virat@123"
    });
    try{
    await user.save();
    res.send("User added successfully!");
    }
    catch(err){
        res.status(400).send("Error saving user ", err.message)
    }
})



connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Our server start at port 3000");

    })
})
    .catch(err => {
        console.log("Database cannot be cannected!!");
    })
