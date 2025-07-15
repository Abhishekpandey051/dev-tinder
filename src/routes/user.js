const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skill emailId photoUrl about"

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

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const logedInUser = req.user;
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: logedInUser._id},
                {toUserId: logedInUser._id}
            ]
        }).select("fromUserId  toUserId")

        const hideUserFromFeed = new Set();

        connectionRequest.forEach((request) => {
            hideUserFromFeed.add(request.fromUserId.toString()),
            hideUserFromFeed.add(request.toUserId.toString());
        })

        const user = await User.find({
            $and: [
                {_id: {$nin:Array.from(hideUserFromFeed)}},
                {_id: {$ne: logedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.json({data: user})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = {
    userRouter,
}