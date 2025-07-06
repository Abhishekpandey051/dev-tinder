const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try{
    await user.save();
    res.send("User added successfully!");
    }
    catch(err){
        res.status(400).send("Error saving user " + err.message)
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const getUser = await User.findOne({emailId:userEmail});
        if(getUser.length === 0){
            res.status(404).send("User not found")
        }else{
        res.send(getUser)
        }
    }
    catch(err){
        res.status(404).send("Something went wrong!!")
    }
})

app.delete('/user', async(req, res) => {
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully")
    }
    catch(err){
        res.status(404

        ).send("Something wend wrong")
    }
})
// need to update document using user email id
app.patch("/user", async(req, res) => {
    const userId = req.body.userId
    const data = req.body
    try{
       const user = await User.findByIdAndUpdate({_id:userId}, data,{retutnDocument: 'before', runValidators: true} )
       console.log(user)
        res.send("User upadate successfully")
    }catch(err){
        res.status(404).send("Update failed " + err.message)
    }
})


app.get("/feed", async(req, res) => {
    try{
        const user = await User.find({})
        res.send(user)
    }catch(err){
        res.status(404).send("Something went wrong")
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
