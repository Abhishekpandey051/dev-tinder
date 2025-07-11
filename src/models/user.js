const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        trim:true
    },
    lastName: {
        type:String,
        trim:true
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    password: {
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password " + value)
            }
        }
    },
    gender: {
        type: String,
        trim:true,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data not be validate");
                
            }
        }
    },
    photoUrl: {
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vBz9VgjksAaZZkWOm8Lk3ZSb7gO25eP0-Q&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo url" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of thes user!",
        minLength: 10,
        maxLength: 100,
        trim: true
    },
    skill: {
        type: [String]
    }
},
{
    timestamps:true
})

userSchema.methods.getJWT = async function(){
    const user = this
const token = await jwt.sign({ _id: user._id }, "Abhi@123", {expiresIn: "1d"});
return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const isPassworsValid = await bcrypt.compare(passwordInputByUser, user.password);
    return isPassworsValid
}

const User = mongoose.model('User', userSchema);

module.exports = User