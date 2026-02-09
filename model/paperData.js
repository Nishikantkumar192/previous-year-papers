const mongoose=require("mongoose");

const dataSchema=new mongoose.Schema({
    year:{
        type:Number,
        required:true,
    },
    semester:{
        type:Number,
        required:true,
    },
    term:{
        type:String,
        required:true,
    },
    branch:{
        type:String,
        required:true,
    },
    subjectCode:{
        type:String,
        required:true,
    },
    image:{
        url:String,
        filename:String,
    }
})

//if any of the information is different then it will treat this as unique;
dataSchema.index(
    {
    year:Number,
    semester:Number,
    term:String,
    brach:String,
    subjectCode:String,
    },
    {unique:true}
);

const Data=mongoose.model("Data",dataSchema);
module.exports=Data;