const express = require('express');
const { validateSignUpData } = require('../utils/validation')
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { userAuth } = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User added successfully!");
    }
    catch (err) {
        res.status(400).send("ERROR :" + err.message)
    }
})

//Login API
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credentials ")
        }

        const isPassworsValid = await user.validatePassword(password)
        if (isPassworsValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),  // cookie will be removed after 8 hours
                httpOnly: true
            })
            res.send("Login successfull!!")
        } else {
            throw new Error("Invalid credential")
        }
    }
    catch (err) {
        res.status(404).send("ERROR :" + err.message)
    }
})

// Logout API
authRouter.post("/logout", userAuth, async(req, res) => {
    try{
        res.cookie("token", null, {expires: new Date(Date.now())})
        res.send("Logout successfull")
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
})

module.exports = authRouter