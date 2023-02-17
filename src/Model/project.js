const {sequelize,Sequelize}= require('./index');

const project=sequelize.define('tbl_projects',{
    project_name:{type:Sequelize.STRING,allowNull:false},
    project_description:{type:Sequelize.STRING,allowNull:false},
    project_goal:{type:Sequelize.STRING,allowNull:false},
    start_date:{type:Sequelize.DATE,allowNull:false},
    end_date:{type:Sequelize.DATE,allowNull:false},
    donation_status:{type:Sequelize.BOOLEAN,allowNull:false,defaultValue:false},
    status:{type:Sequelize.BOOLEAN,allowNull:false,defaultValue:true},
    category:{type:Sequelize.STRING,allowNull:false},
});
    
const projectImages= sequelize.define('tbl_project_images',{
    project_id:{type:Sequelize.INTEGER,allowNull:false},
    file_name:{type:Sequelize.STRING,allowNull:false},
    image_location:{type:Sequelize.STRING,allowNull:false},
})

const projectDocs= sequelize.define('tbl_project_docs',{
    project_id:{type:Sequelize.INTEGER,allowNull:false},
    file_name:{type:Sequelize.STRING,allowNull:false},
    location:{type:Sequelize.STRING,allowNull:false},
})

project.hasMany(projectImages,{onDelete:'CASCADE',foreignKey:'project_id',as:'images'});
projectImages.belongsTo(project,{foreignKey:'project_id'});

project.hasMany(projectDocs,{onDelete:'CASCADE',foreignKey:'project_id',as:'docs'});
projectDocs.belongsTo(project,{foreignKey:'project_id'});


module.exports= {project,projectImages,projectDocs,sequelize,Sequelize}
