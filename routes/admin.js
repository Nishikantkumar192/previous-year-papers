const express=require("express");
const router=express.Router();
const User=require("../model/user.js")

router.get("/ListOfAdmin",async(req,res)=>{
    const AdminList=await User.find({role:"admin"});
    res.render("AdminFolder/admin.js",{AdminList});
})

module.exports=router;