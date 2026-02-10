const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    next();
}
module.exports.isAdmin=(req,res,next)=>{
    if(req.user.role !== "admin"){
        return next(new ExpressError(403,"You don't have permission's to do this"));
    }
    next();
}