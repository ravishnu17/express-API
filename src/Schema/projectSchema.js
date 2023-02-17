const Joi = require("joi")

const projectSchema=Joi.object({
    project_name:Joi.string().required(),
    project_description:Joi.string().required(),
    project_goal:Joi.number().required(),
    start_date:Joi.date().required(),
    end_date:Joi.date().required(),
    status:Joi.boolean().required(),
    category:Joi.string().required()
}).options({abortEarly:false});

module.exports= projectSchema