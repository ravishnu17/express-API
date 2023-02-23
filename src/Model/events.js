const {Sequelize,sequelize}= require('./audition');

const Events=sequelize.define('tbl_events',{
    event_name:{type:Sequelize.STRING,allowNull:false},
    start_date:{type:Sequelize.DATE,allowNull:false},
    start_time:{type:Sequelize.TIME,allowNull:false},
    end_date:{type:Sequelize.DATE,allowNull:false},
    end_time:{type:Sequelize.TIME,allowNull:false},
    event_type:{type:Sequelize.STRING,allowNull:false},
    location:{type:Sequelize.STRING,allowNull:false},
    email_id:{type:Sequelize.STRING,allowNull:false},
    mobile_no:{type:Sequelize.BIGINT,allowNull:false},
    event_status:{type:Sequelize.BOOLEAN,defaultValue:'true',allowNull:false},
    booking_status:{type:Sequelize.BOOLEAN,defaultValue:'true',allowNull:false},
    ticket_price:{type:Sequelize.FLOAT,allowNull:false},
    ticket_count:{type:Sequelize.INTEGER,allowNull:false},
    live_link:{type:Sequelize.STRING,allowNull:true},
    description:{type:Sequelize.TEXT,allowNull:false}
})

const Event_images= sequelize.define('tbl_event_images',{
    filename:{type:Sequelize.STRING,allowNull:false},
    location:{type:Sequelize.STRING,allowNull:false},
})

Events.hasMany(Event_images,{onDelete:"CASCADE",as:'images'});

module.exports= {Events,Event_images,Sequelize,sequelize}