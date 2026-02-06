let options=document.querySelector(".options");
let navbar=document.querySelector(".navbar");

let hamburger=document.querySelector(".hamburger");
hamburger.addEventListener("click",()=>{
    navbar.style.display="flex";
    navbar.style.flexDirection="column";
    options.style.display="block";
    hamburger.style.display="none";
    crossSign.style.display="block";
})
let crossSign=document.querySelector(".crossSign");
crossSign.addEventListener("click",()=>{
    navbar.style.display="flex";
    navbar.style.flexDirection="row";
    options.style.display="none";
    hamburger.style.display="block";
    crossSign.style.display="none";
})