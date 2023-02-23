const Joi= require('joi')

const eventSchema= Joi.object({
    event_name:Joi.string().required(),
    start_date:Joi.date().required(),
    end_date:Joi.date().required(),
    start_time:Joi.string().required(),
    end_time:Joi.string().required(),
    event_type:Joi.string().required(),
    location:Joi.string().required(),
    email_id:Joi.string().email().required(),
    mobile_no:Joi.number().required(),
    event_status:Joi.boolean(),
    booking_status:Joi.boolean(),
    ticket_price:Joi.string().required(),
    ticket_count:Joi.string().required(),
    live_link:Joi.string(),
    description:Joi.string().required(),
}).options({abortEarly:false});

module.exports= eventSchema