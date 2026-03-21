const express=require("express");
const router=express.Router();
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
const Data=require("../model/paperData.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js")
const {isLoggedIn,isAdmin}=require("../middleware.js");
const paperSchema=require("../joiSchema.js");

router.get("/",(req,res)=>{
    res.render("Home/index.ejs");
})

router.get("/search",(req,res)=>{
    res.render("Home/searchPage.ejs");
})

const validateListing=(req,res,next)=>{
    const {error}=paperSchema.validate(req.body);
    if(error){
        const errMsg=error.details.map((el)=>el.message).join(",");
        next(new ExpressError(400,errMsg));
    }else{
        next();
    }
}
router.post("/search",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    let result={
        ...req.body.result,
        year:Number(req.body.result.year),
        semester:Number(req.body.result.semester),
    }
    result.subjectCode=result.subjectCode.trim().toLowerCase();
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
    res.render("Home/show.ejs",{matchData})
}));

router.get("/new",(req,res)=>{
    res.render("Home/new.ejs");
})

router.post("/new",isLoggedIn,isAdmin,validateListing,upload.single("result[image]"),wrapAsync(async(req,res,next)=>{
    if(!req.body.listing) return next(new ExpressError(400,"Invalid Informations"));
        let url=req.file.path;
        let filename=req.file.filename;
        const newData=new Data({
            ...req.body.result,
            year:Number(req.body.result.year),
            semester:Number(req.body.result.semester),
        })
        newData.subjectCode=newData.subjectCode.trim().toLowerCase();
        newData.image={url,filename};
        await newData.save();
        res.redirect("/results/new");
}));

module.exports=router;