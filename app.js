if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const port=8080;
const engine=require("ejs-mate");
const path=require("path");
const Data=require("./model/paperData");
const multer=require("multer");
const {storage}=require("./cloudConfig");
const upload=multer({storage});

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",engine);
app.set("view engine","ejs");

app.listen(port,()=>{
    console.log(`app is listing through port ${port}`);
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
app.post("/results/info",async(req,res)=>{
    let result=req.body;
    // let info=await Data.find({
    //     year:result.year,
    //     // semester:result.semester,
    //     // term:result.term,
    //     // branch:result.branch,
    //     // subject:result.subject,
    // })
    console.log(result.term);
    res.send("successful");
})
app.get("/results/new",(req,res)=>{
    res.render("Home/new.ejs");
})
app.post("/results/new",upload.single("result[image]"),(req,res)=>{
    console.log(req.file);
    res.send("successful");
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
app.post("/user/signup",(req,res)=>{
    res.send("its working");
})