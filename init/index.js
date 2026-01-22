const mongoose=require("mongoose");
const initData=require("./data");
const Data=require("../model/paperData");

const MONGO_URL='mongodb://127.0.0.1:27017/previousYear';
main().then(()=>{
    console.log("connected Successfully");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Data.deleteMany({});
    await Data.insertMany(initData);
    console.log("data initialized successfully");
}
initDB();