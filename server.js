const express= require('express');
require('dotenv').config();
const cors=require('cors');
const morgan= require('morgan');
const fileUpload= require('express-fileupload');
const db= require('./src/Model/user');
const {projectRoutes,userRoutes}= require('./src/Controller/routes');

//create db tables
db.sequelize.sync({alter:true});

const port= process.env.port;
const app= express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({createParentPath:true}));

//Routes
app.use('/projects',projectRoutes);
app.use('/users',userRoutes);

app.get('/',(req,res)=>{
    res.send('Works well');
});

app.listen(port,()=>{
    console.log("Server started "+port);
})