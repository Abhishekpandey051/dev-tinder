const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ingonred", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrected status type ` 
        }
    }
},
{
    timestamps:true
})

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself")
    }
    next()

})

const ConnectionRequestModels = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModels