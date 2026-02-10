const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },
    isSuperAdmin:{
        type:Boolean,
        default:false,
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
