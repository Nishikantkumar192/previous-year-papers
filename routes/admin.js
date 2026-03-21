const express=require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const User=require("../model/user.js");
const {isLoggedIn,isAdmin,isSuperAdmin}=require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/ListOfAdmin",isLoggedIn,isAdmin,isSuperAdmin,wrapAsync(async(req,res)=>{
    const AdminList=await User.find({role:"admin"});
    res.render("AdminFolder/admin.ejs",{AdminList});
}));

router.get("/update/:id",isLoggedIn,isAdmin,isSuperAdmin,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const userDetails=await User.findById(id);
    if(!userDetails) return next(new ExpressError(204,"Invalid user"));
    userDetails.role="user";
    await userDetails.save();
    res.redirect("/admin/ListOfAdmin");
}));

router.get("/showUsers",isLoggedIn,isAdmin,wrapAsync(async(req,res)=>{
    const userDetails=await User.find({role:"user"});
    res.render("AdminFolder/allUser.ejs",{userDetails});
}));

module.exports=router;