const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ingonred", "interested", "accepeted", "rejected"],
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