const {sequelize,Sequelize}=require('./project');

const user=sequelize.define('tbl_users',{
    first_name:{type:Sequelize.STRING,allowNull:false},
    last_name:{type:Sequelize.STRING},
    mobile_no:{type:Sequelize.BIGINT,allowNull:false},
    email_id:{type:Sequelize.STRING,allowNull:false},
    password:{type:Sequelize.STRING,allowNull:false},
    status:{type:Sequelize.BOOLEAN,allowNull:false,defaultValue:false},
});

const mailList=sequelize.define('tbl_mailList',{
    mail_id:{type:Sequelize.STRING,allowNull:false},
})

module.exports={user,mailList, sequelize,Sequelize}