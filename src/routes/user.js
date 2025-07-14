const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skill emailId photoUrl"

userRouter.get("/user/requests", userAuth, async (req, res) => {
    try{
        const logedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: logedInUser._id,
            status:"interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        res.json({message: 'Data fetch successfully' , data: connectionRequest})
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/connection", userAuth, async(req, res) => {
    try{
        const logedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId:logedInUser._id, status:'accepted'},
                {toUserId:logedInUser._id, status:"accepted"}
            ]
        }).populate('fromUserId', USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === logedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({data})

    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = {
    userRouter,
}