const express=require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../model/user.js");
const ExpressError=require("../utils/ExpressError.js");
const transporter=require("../config/nodemailer.js")
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
router.get("/forget",(req,res)=>{
    res.render("user/passwordReset.ejs");
})

router.post("/forget",async(req,res,next)=>{
    const {email}=req.body;
    try{
        if(!email){
            return next(new ExpressError(400,"Invalid Email"));
        }
        const user=await User.findOne({email});
        if(!user){
            return next(new ExpressError(400,"Invalid Email"));
        }
        const otp=String(Math.floor(100000+Math.random()*900000));
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+5*60*1000;
        const emailSend={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Reset Password OTP",
            text:`Your OTP for resetting your password is: ${otp} .This OTP is valid for 5 minutes. Do not share it with anyone.`
        }
        await user.save();
        await transporter.sendMail(emailSend);
        res.render("user/OtpVerification");
    }catch(err){
        return next(new ExpressError(500,err.message));
    }
})

router.post("/otp-verification",async(req,res,next)=>{
    const {email,otp,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user) return next(new ExpressError(400,"Invalid Email"));
        if(otp!=user.resetOtp) return next(new ExpressError(400,"Invalid OTP"));
        if(user.resetOtpExpireAt < Date.now()) return next(new ExpressError(400,"OTP Expired"));
        await user.setPassword(password);
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();
        res.render("user/login.ejs");
    }catch(err){
        return next(new ExpressError(500,err.message));
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