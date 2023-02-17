const express= require('express');
require('dotenv').config();
const cors=require('cors');
const morgan= require('morgan');
const fileUpload= require('express-fileupload');
const db= require('./src/Model/audition');
const {projectRoutes,userRoutes, auditionRouts}= require('./src/Controller/routes');

//create db tables
db.sequelize.sync({alter:true});

const port= process.env.port;
const app= express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({createParentPath:true}));
app.use("/Assets",express.static("Assets"))

//Routes
app.use('/projects',projectRoutes);
app.use('/users',userRoutes);
app.use('/audition',auditionRouts);

app.get('/',(req,res)=>{
    res.send('Works well');
});

app.listen(port,()=>{
    console.log("Server started "+port);
})