const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const {isLoggedIn,isAdmin,isSuperAdmin}=require("../middleware.js");

router.get("/ListOfAdmin",isLoggedIn,isAdmin,isSuperAdmin,async(req,res)=>{
    const AdminList=await User.find({role:"admin"});
    res.render("AdminFolder/admin.ejs",{AdminList});
})
router.get("/update/:id",isLoggedIn,isAdmin,isSuperAdmin,async(req,res)=>{
    const {id}=req.params;
    const userDetails=await User.findById(id);
    userDetails.role="user";
    await userDetails.save();
    res.redirect("/admin/ListOfAdmin");
})
router.get("/showUsers",isLoggedIn,isAdmin,async(req,res)=>{
    const userDetails=await User.find({role:"user"});
    res.render("AdminFolder/allUser.ejs",{userDetails});
})
router.get("/removeUser/:id",isLoggedIn,isAdmin,async(req,res)=>{
    let {id}=req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/admin/showUsers");
})

// TODO (Data Integrity): Implement cascading delete to remove user posts when a user is deleted

module.exports=router;