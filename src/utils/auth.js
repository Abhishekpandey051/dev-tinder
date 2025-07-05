
const adminAuth = (req, res, next) => {
    const token = 'xyz'
    const isAuthorized = token === 'xyz'

    if(!isAuthorized){
        res.status(401).send("Admin not authorized");
    }
    else{
        next();
    }

}

const userAuth = (req, res, next) => {
    const token = 'xyza';
    const isUserAuth = token === 'xyz';
    if(!isUserAuth){
        res.status(401).send("User not authorized");
    }else{
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}