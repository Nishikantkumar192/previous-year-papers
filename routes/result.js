const express=require("express");
const router=express.Router();
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
const Data=require("../model/paperData.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn}=require("../middleware.js");


router.get("/",(req,res)=>{
    res.render("Home/index.ejs");
})

router.get("/search",(req,res)=>{
    res.render("Home/searchPage.ejs");
})

router.post("/search",isLoggedIn,async(req,res,next)=>{
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
        subjectCode:result.subjectCode
    })
    if(!matchData){
        return next(new ExpressError(404,"Sorry this is paper is unavailable if you have then please upload"));
    }
    res.render("Home/show.ejs",{matchData});
})

router.get("/new",(req,res)=>{
    res.render("Home/new.ejs");
})

router.post("/new",isLoggedIn,upload.single("result[image]"),async(req,res)=>{
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

router.get("/back",(req,res)=>{
    res.redirect("/results");
})

module.exports=router;