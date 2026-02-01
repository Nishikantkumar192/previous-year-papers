const express=require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../model/user.js");

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post("/login", passport.authenticate('local',{failureRedirect:"/login"}),(req,res)=>{
    req.flash("success","you have logged-in Successfully");
    res.redirect("/results");
})

router.get("/signup",(req,res)=>{
    res.render("user/signup");
})

router.post("/signup",async(req,res)=>{
   try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        await User.register(newUser,password);
        res.redirect("/results");
   }catch(e){
    res.redirect("/signup");
   }
})
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        res.redirect("/results");
    })
})

module.exports=router;