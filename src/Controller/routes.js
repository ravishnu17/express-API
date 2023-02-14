const { Router } = require('express')
const { viewProjects, addProjects, viewprojectImage, updateProjects, deleteProjects, viewProjectsByID, deleteprojectImage,searchProject } = require('./Projects/projects')
const { addUser, login, viewUser, deleteUser } = require('./Users/user');
const { authenticateToken } = require('../Auth/auth');
const {sendMail,subscribe,unsubscribe,viewsubscriber}=require('./Mail/mail')

const projectRoutes = new Router();
const userRoutes = new Router();
//projects routes
projectRoutes.get('/view', authenticateToken, viewProjects);
projectRoutes.get('/view/:id', authenticateToken, viewProjectsByID);
projectRoutes.get('/viewimages/:id', viewprojectImage);
projectRoutes.delete('/deleteimages/:id', authenticateToken, deleteprojectImage);
projectRoutes.post('/add', authenticateToken, addProjects);
projectRoutes.put('/update/:id', authenticateToken, updateProjects);
projectRoutes.delete('/delete/:id', authenticateToken, deleteProjects);
projectRoutes.get('/search/:value', authenticateToken, searchProject);

//User routes
userRoutes.get('/view',authenticateToken, viewUser);
userRoutes.post('/login', login);
userRoutes.delete('/delete',authenticateToken, deleteUser);
userRoutes.post('/register', addUser);
userRoutes.post('/sendMail',sendMail);
userRoutes.post('/subscribe',subscribe);
userRoutes.delete('/unsubscribe/:id',unsubscribe);
userRoutes.get('/subscriberlist',viewsubscriber);

module.exports = { projectRoutes, userRoutes };