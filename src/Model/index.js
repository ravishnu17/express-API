const Sequelize= require('sequelize');

const db_url= process.env.db_url;
const sequelize=new Sequelize(db_url,{logging:false});

try{
    sequelize.authenticate();
    console.log("DB connected");
}catch{
    console.log("Can't connect to DB");
}

// const db={}
// db.sequelize= sequelize;
// db.Project= require('./project')(sequelize);

module.exports= {sequelize,Sequelize}