const {sequelize,Sequelize}= require('./user')

const audition=sequelize.define('tbl_audition',{
    name:{type:Sequelize.STRING,allowNull:false},
    mobile_no:{type:Sequelize.BIGINT,allowNull:false},
    email_id:{type:Sequelize.STRING,allowNull:false},
    description:{type:Sequelize.TEXT,allowNull:false}
});

const audition_images=sequelize.define('tbl_audition_images',{
    filename:{type:Sequelize.STRING,allowNull:false},
    location:{type:Sequelize.STRING,allowNull:false}
});

const audition_video=sequelize.define('tbl_audition_video',{
    filename:{type:Sequelize.STRING,allowNull:false},
    location:{type:Sequelize.STRING,allowNull:false}
});

const audition_links=sequelize.define('tbl_audition_links',{
    audition_links:{type:Sequelize.STRING,allowNull:false}
});

audition.hasMany(audition_images,{onDelete:'CASCADE',as:'images'});
audition_images.belongsTo(audition)

audition.hasMany(audition_video,{onDelete:'CASCADE',as:'videos'});
audition_video.belongsTo(audition);

audition.hasMany(audition_links,{onDelete:'CASCADE',as:'links'});
audition_links.belongsTo(audition)

module.exports= {sequelize,Sequelize,audition,audition_images,audition_video,audition_links}