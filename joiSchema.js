const joi=require("joi");

const paperSchema=joi.object({
    year:joi.number().required(),
    semester:joi.number().required(),
    startFrom:joi.string().required(),
    term:joi.string().required(),
    branch:joi.string().required(),
    subjectCode:joi.string().required(),
    image:joi.any(),
}).required();

module.exports=paperSchema;