const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt');
app.use(express.json());

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

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const getUser = await User.findOne({ emailId: userEmail });
        if (getUser.length === 0) {
            res.status(404).send("User not found")
        } else {
            res.send(getUser)
        }
    }
    catch (err) {
        res.status(404).send("Something went wrong!!")
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
            res.send("Login successfull!!")
        } else {
            throw new Error("Invalid credential")
        }

    }
    catch (err) {
        res.status(404).send("ERROR :" + err.message)
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully")
    }
    catch (err) {
        res.status(404

        ).send("Something wend wrong")
    }
})
// need to update document using user email id
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body
    try {
        const ALLOWED_UPDATE = ["gender", "age", "skill", "photoUrl", "about", "password"]
        const isUpdateAllow = Object.keys(data).every((k) => ALLOWED_UPDATE.includes(k))
        if (!isUpdateAllow) {
            throw new Error("Update not allow")
        }
        if (data.skill.length > 10) {
            throw new Error("Skill cannot be more than 10")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { retutnDocument: 'before', runValidators: true })
        console.log(user)
        res.send("User upadate successfully " + user)
    } catch (err) {
        res.status(404).send("Update failed " + err.message)
    }
})


app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user)
    } catch (err) {
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
