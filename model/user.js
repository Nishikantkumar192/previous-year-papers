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
    },
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type:Number,default:0},
})

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
