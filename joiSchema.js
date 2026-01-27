const joi=require("joi");

const Schema=joi.object({
    year:joi.number().required(),
    semester:joi.number().required(),
    term:joi.string().required(),
    branch:joi.string().required(),
    subject:joi.string().required(),
    image:{
        url:joi.string().required(),
        filename:joi.string().required(),
    }
}).required();

module.exports=Schema;