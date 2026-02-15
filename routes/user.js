const express=require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../model/user.js");
const ExpressError=require("../utils/ExpressError.js");
const {body,validationResult}=require("express-validator");

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post("/login", passport.authenticate('local',{failureRedirect:"/login"}),(req,res)=>{
    res.redirect("/results");
})

router.get("/signup",(req,res)=>{
    res.render("user/signup");
})

router.post("/signup",[
    body("username","Username must be greater than 5 character").isLength({min:5}),
    body("email","The formate of Email is Not correct").isEmail(),
    body("password","Password must be greater than 5 character").isLength({min:5}),
],async(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        const errMsg=error.array().map(err=>err.msg).join(",");
        return next(new ExpressError(400,errMsg));
    }
   try{
        let {username,email,password}=req.body;
        let newUser=await User.findOne({email});
        if(newUser){
            return next(new ExpressError(409,"Email already exists. Registration is not allowed with the same email."))
        }
        newUser=new User({username,email});
        await User.register(newUser,password);
        
        res.redirect("/results");
   }catch(e){
    console.log(e);
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