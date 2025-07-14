const express = require('express');
const connectDB = require('./config/database')
const app = express();
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require('./routes/user');
app.use(express.json());
app.use(cookieParser())

app.use("/", authRouter, profileRouter, requestRouter, userRouter);


connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
        console.log("Our server start at port 3000");

    })
})
    .catch(err => {
        console.log("Database cannot be cannected!!");
    })
