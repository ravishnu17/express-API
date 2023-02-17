const { Router } = require('express')
const { viewProjects, addProjects, viewprojectImage, updateProjects, deleteProjects, viewProjectsByID, deleteprojectImage,searchProject, deleteprojectDocx, viewprojectDocx } = require('./Project/projects')
const { addUser, login, viewUser, deleteUser } = require('./Users/user');
const { authenticateToken } = require('../Auth/auth');
const {sendMail,subscribe,unsubscribe,viewsubscriber}=require('./Mail/mail');
const audition= require('./Audition/audition')

const projectRoutes = new Router();
const userRoutes = new Router();
const auditionRouts = new Router();
//projects routes
projectRoutes.get('/view', authenticateToken,viewProjects);
projectRoutes.get('/view/:id', authenticateToken, viewProjectsByID);
projectRoutes.get('/viewimages/:id', viewprojectImage);
projectRoutes.delete('/deleteimages/:id', authenticateToken, deleteprojectImage);
projectRoutes.get('/viewdocx/:id', viewprojectDocx);
projectRoutes.delete('/deletedocx/:id', authenticateToken, deleteprojectDocx);
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
userRoutes.delete('/unsubscribe',unsubscribe);
userRoutes.get('/subscriberlist',viewsubscriber);

//Audition routes
auditionRouts.get('/view',authenticateToken, audition.ViewAudition);
auditionRouts.post('/add', audition.AddAudition);
auditionRouts.delete('/delete/:id',authenticateToken, audition.DeleteAudition);
auditionRouts.put('/edit/:id', authenticateToken,audition.EditAudition);
auditionRouts.delete('/deleteimage/:id',authenticateToken,audition.DeleteAuditionImage);
auditionRouts.delete('/deletevideo/:id',authenticateToken, audition.DeleteAuditionVideo);
auditionRouts.delete('/deletelink/:id',authenticateToken, audition.DeleteAuditionLink);
auditionRouts.get('/view/:id',authenticateToken, audition.ViewSPecificAudition);

module.exports = { projectRoutes, userRoutes,auditionRouts };