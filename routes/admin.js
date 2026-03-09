const express=require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const User=require("../model/user.js");
const {isLoggedIn,isAdmin,isSuperAdmin}=require("../middleware.js");

router.get("/ListOfAdmin",isLoggedIn,isAdmin,isSuperAdmin,async(req,res)=>{
    try{
        const AdminList=await User.find({role:"admin"});
        res.render("AdminFolder/admin.ejs",{AdminList});
    }catch(err){
        return new ExpressError(500,err.message);
    }
})
router.get("/update/:id",isLoggedIn,isAdmin,isSuperAdmin,async(req,res)=>{

    try{
        const {id}=req.params;
        const userDetails=await User.findById(id);
        userDetails.role="user";
        await userDetails.save();
        res.redirect("/admin/ListOfAdmin");
    }catch(err){
        return new ExpressError(500,err.message);
    }
})
router.get("/showUsers",isLoggedIn,isAdmin,async(req,res)=>{
    try{
        const userDetails=await User.find({role:"user"});
        res.render("AdminFolder/allUser.ejs",{userDetails});
    }catch(err){
        return new ExpressError(500,err.message);
    }
})
router.get("/changeUserRole/:id",isLoggedIn,isAdmin,async(req,res)=>{
    try{
        let {id}=req.params;
        const userRole=await User.findById(id);
        userRole.role="admin";
        await userRole.save();
        res.redirect("/admin/showUsers");
    }catch(err){
        return new ExpressError(500,err.message);
    }
})

// TODO (Data Integrity): Implement cascading delete to remove user posts when a user is deleted

module.exports=router;