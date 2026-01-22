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
    subject:{
        type:String,
        required:true,
    },
    image:{
        url:String,
        filename:String,
    }
})

const Data=mongoose.model("Data",dataSchema);
module.exports=Data;