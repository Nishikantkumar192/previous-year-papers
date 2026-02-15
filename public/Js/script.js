const options=document.querySelector(".options");
const navbar=document.querySelector(".navbar");

const hamburger=document.querySelector(".hamburger");
hamburger.addEventListener("click",()=>{
    navbar.style.display="flex";
    navbar.style.flexDirection="column";
    navbar.style.alignItems="start";
    options.style.display="block";
    hamburger.style.display="none";
    crossSign.style.display="block";
})
const crossSign=document.querySelector(".crossSign");
crossSign.addEventListener("click",()=>{
    navbar.style.display="flex";
    navbar.style.flexDirection="row";
    options.style.display="none";
    hamburger.style.display="block";
    crossSign.style.display="none";
})

setTimeout(()=>{
    document.getElementById("note").style.display="none";
},60000)