const express = require('express');

const app = express();
const {adminAuth, userAuth} = require('./utils/auth')

app.use('/admin', adminAuth )

app.get("/admin/getAllData", (req, res, next) => {
   res.send("admin data fetched")
   next();
})

app.get('/user', userAuth, (req, res) => {
    res.send("User data fetched")
})

app.post('/admin/deleteUser', (req, res) => {
    console.log("Delete user")
    res.send("Delete Admin user")
})


app.listen(3000, () => {
    console.log("Our server start at port 3000");
    
})