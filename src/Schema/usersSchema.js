const Joi = require('joi');

const subscribeSchema = Joi.object({
  mail_id: Joi.string().email().required()
});

const mailSchema= Joi.object({
    mail_id:Joi.string().required(),
    subject:Joi.string().required(),
    text:Joi.string().required()
});

const userSchema=Joi.object({
    first_name:Joi.string().required(),
    last_name:Joi.string().required(),
    mobile_no:Joi.number().required(),
    email_id:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
});

const loginSchema=Joi.object({
    username:Joi.string().email().required(),
    password:Joi.string().required()
});

module.exports= {subscribeSchema,mailSchema, userSchema,loginSchema}