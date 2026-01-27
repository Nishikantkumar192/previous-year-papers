if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const port=8080;
const engine=require("ejs-mate");
const path=require("path");
const Data=require("./model/paperData.js");
const User=require("./model/user.js");
const multer=require("multer");
const {storage}=require("./cloudConfig");
const upload=multer({storage});
const joiSchema=require("./joiSchema");
const mongoose=require("mongoose");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const MONGO_URL='mongodb://127.0.0.1:27017/previousYear';
main().then(()=>{
    console.log("connected Successfully");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",engine);
app.set("view engine","ejs");

const sessionOption={
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 9 * 24 * 60 * 60 * 1000,
        maxAge:9 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(port,()=>{
    console.log(`app is listing through port ${port}`);
})

app.get("/",(req,res)=>{
    res.redirect("/results");
})
app.get("/results",(req,res)=>{
    res.render("Home/index.ejs");
})
app.get("/results/document",(req,res)=>{
    res.render("Home/usefulDoc.ejs");
})
app.get("/results/search",(req,res)=>{
    res.render("Home/searchPage.ejs");
})
app.post("/results/info",async(req,res,next)=>{
    let result={
        ...req.body.result,
        year:Number(req.body.result.year),
        semester:Number(req.body.result.semester),
    }
    const matchData=await Data.findOne({
        year:result.year,
        semester:result.semester,
        term:result.term,
        branch:result.branch,
        subject:result.subject
    })
    if(!matchData){
        return next(new ExpressError(404,"I don't have this paper if you have then please upload"));
    }
    res.render("Home/show.ejs",{matchData});
})
app.get("/results/new",(req,res)=>{
    res.render("Home/new.ejs");
})
app.post("/results/new",upload.single("result[image]"),async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newData=new Data({
        ...req.body.result,
        year:Number(req.body.result.year),
        semester:Number(req.body.result.semester),
    })
    newData.image={url,filename};
    await newData.save();
    res.redirect("/results/new");
})
app.get("/results/back",(req,res)=>{
    res.redirect("/results/new");
})
app.get("/user/login",(req,res)=>{
    res.render("user/login.ejs");
})
app.post("/user/login",(req,res)=>{
    res.send("successful");
})
app.get("/user/signup",(req,res)=>{
    res.render("user/signup");
})
app.post("/user/signup",async(req,res)=>{
    let userData=req.body.user;
    let newUser={
        email:userData.email,
        username:userData.username,
    }
    await User.register(newUser,userData.password);
    res.redirect("/results");
})
app.use((req,res,next)=>{
    next(new ExpressError(500,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="Server Error"}=err;
    res.status(status).render("./Home/error.ejs",{message});
})