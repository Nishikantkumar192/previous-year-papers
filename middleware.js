const ExpressError = require("./utils/ExpressError");
const User=require("./model/user.js")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
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
module.exports.isSuperAdmin=async(req,res,next)=>{
    let user=await User.findOne({isSuperAdmin:true});
    if(!user){
        return next(new ExpressError(403,"Permission Denied"));
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl=req.session.redirectUrl;
    }else{
        res.locals.redirectUrl="/";
    }
    next();
}