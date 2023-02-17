const Joi=require('joi')

module.exports= auditionSchema=Joi.object({
    name:Joi.string().required(),
    mobile_no:Joi.number().required(),
    email_id:Joi.string().email().required(),
    description:Joi.string().required(),
    links:Joi.array()
}).options({abortEarly:false});