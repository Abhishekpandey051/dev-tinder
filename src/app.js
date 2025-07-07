const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const {userAuth} = require('./middleware/auth')
app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credentials ")
        }

        const isPassworsValid = await bcrypt.compare(password, user.password);
        if (isPassworsValid) {
            const validateToken = await jwt.sign({ _id: user._id }, "Abhi@123", {expiresIn: "0d"});
            res.cookie("token", validateToken)
            res.send("Login successfull!!")
        } else {
            throw new Error("Invalid credential")
        }

    }
    catch (err) {
        res.status(404).send("ERROR :" + err.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(404).send("ERROR :" + err.message)
    }
})

app.post("/sendingConnectionRequest", userAuth, async(req, res) => {
    const user = req.user
    res.send(user.firstName + "Send connection request");
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
