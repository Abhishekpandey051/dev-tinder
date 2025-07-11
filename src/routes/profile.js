const express = require("express");
const { userAuth } = require("../middleware/auth");
const {validateProfileEditData} = require("../utils/validation")

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user)
    }
    catch(err){
        res.status(404).send("ERROR :" + err.message);
    }

})

// profile edit APi
profileRouter.patch("profile/edit", userAuth, async(req, res) => {
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request ");
        }
        const logedInUser = req.user;

        Object.keys(req.body).forEach((key) => logedInUser[key] = req.body[key]);
        res.json({message: `${logedInUser.firstName}, your profile update successfully`, data: logedInUser})
       await logedInUser.save();
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
})

// profile forgot password
profileRouter.post("/profile/password", async(req, res) => {
    try{

    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter