const expresss = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const requestRouter = expresss.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["interested", "ignored"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type " + status })
        }
        const exitConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message: 'User not found!!'})
        } 

        if (exitConnectionRequest) {
            return res.status(400).json({ message: req.user.firstName+ " is " + status + " in " + toUser.firstName })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const conctionData = await connectionRequest.save();
        res.json({ message: 'Connection request send successfully ', data: conctionData })

    }
    catch (err) {
        res.status(404).send("ERROR : " + err.message)
    }
})


module.exports = requestRouter;