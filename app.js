if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const port=process.env.PORT || 8080;
const engine=require("ejs-mate");
const path=require("path");
const User=require("./model/user.js");
const resultRouter = require("./routes/result");
const userRouter=require("./routes/user");
const adminRouter=require("./routes/admin");
const joiSchema=require("./joiSchema");
const mongoose=require("mongoose");
const session=require("express-session");
const {MongoStore}=require("connect-mongo");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const flash=require("connect-flash");

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",engine);
app.set("view engine","ejs");

const dbUrl=process.env.MONGODB_URL;
main().then(()=>{
    console.log("connected Successfully");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
}

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret:process.env.SESSION_SECRET,
    },
    touchAfter:24*60*60,
})
store.on("error",(err)=>{
    console.log("ERROR occur in mongo-store",err);
})

const sessionOption={
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie:{
        expires:new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        maxAge:9 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.currUser=req.user;
    next();
})

app.listen(port,()=>{
    console.log(`app is listing through port ${port}`);
})

app.get("/",(req,res)=>{
    res.redirect("/results");
})

app.use("/results",resultRouter);
app.use("/",userRouter);
app.use("/admin",adminRouter);

app.use((req,res,next)=>{
    next(new ExpressError(500,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="Server Error"}=err;
    res.status(status).render("./Home/error.ejs",{message});
})