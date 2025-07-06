const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type:String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address!!" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    password: {
        type:String,
        required: true
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data not be valodate");
                
            }
        }
    },
    photoUrl: {
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo url" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of thes user!"
    },
    skill: {
        trype: [String]
    }
},
{
    timestamps:true
})

const User = mongoose.model('User', userSchema);

module.exports = User