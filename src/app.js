const express = require('express');

const app = express();

app.get("/admin/getAllData", (req, res, next) => {
    // handle when db call
    try{
    throw new Error("FGDSSGFs");
     res.send("admin data fetched")
     next();
    }
    catch(err){
        res.status(500).send("Some error accure contact support team")
    }
})

// handle error globally - if any error in our app then show error from here
app.use('/', (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong")
    }
})


app.listen(3000, () => {
    console.log("Our server start at port 3000");
    
})