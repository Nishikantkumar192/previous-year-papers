const express=require("express");
const app=express();
const port=8080;
const engine=require("ejs-mate");
const path=require("path");

app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",engine);
app.set("view engine","ejs");

app.listen(port,()=>{
    console.log(`app is listing through port ${port}`);
})
app.get("/",(req,res)=>{
    res.render("Home/index.ejs",{layout:false});
})

