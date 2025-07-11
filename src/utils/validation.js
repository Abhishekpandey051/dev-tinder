const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}

const validateProfileEditData = (req) => {
    const user = req.body;
    const allowedUserEditFeild = ["firstName", "lastName", "emailId", "gender", "about", "photoUrl", "skill", "age"]
    const isEditAllowed = Object.keys(req.body).every(field => allowedUserEditFeild.includes(field) )
    // need validation on skill and photoUrl
    
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateProfileEditData,
}