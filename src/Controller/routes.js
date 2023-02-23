const { Router } = require('express')
const projects = require('./Project/projects')
const users = require('./Users/user');
const { authenticateToken } = require('../Auth/auth');
const {sendMail,subscribe,unsubscribe,viewsubscriber}=require('./Mail/mail');
const audition= require('./Audition/audition');
const events= require('./Events/event')

const projectRoutes = new Router();
const userRoutes = new Router();
const auditionRouts = new Router();
const eventRoutes= new Router();
//projects routes
projectRoutes.get('/view', authenticateToken,projects.viewProjects);
projectRoutes.get('/view/:id', authenticateToken, projects.viewProjectsByID);
projectRoutes.get('/viewimages/:id', projects.viewprojectImage);
projectRoutes.delete('/deleteimages/:id', authenticateToken, projects.deleteprojectImage);
projectRoutes.get('/viewdocx/:id', projects.viewprojectDocx);
projectRoutes.delete('/deletedocx/:id', authenticateToken, projects.deleteprojectDocx);
projectRoutes.post('/add', authenticateToken, projects.addProjects);
projectRoutes.put('/update/:id', authenticateToken, projects.updateProjects);
projectRoutes.delete('/delete/:id', authenticateToken, projects.deleteProjects);
projectRoutes.get('/search/:value', authenticateToken, projects.searchProject);

//User routes
userRoutes.get('/view',authenticateToken, users.viewUser);
userRoutes.post('/login', users.login);
userRoutes.delete('/delete',authenticateToken, users.deleteUser);
userRoutes.post('/register', users.addUser);
userRoutes.put('/update',authenticateToken, users.updateUser); 
userRoutes.put('/updatepassword',authenticateToken, users.updatePassword); 
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

//Event modules
eventRoutes.get('/view',events.ViewEvents)
eventRoutes.get('/view/:id',events.ViewEventsByID)
eventRoutes.post('/add',events.AddEvents)
eventRoutes.put('/update/:id',events.EditEvents)
eventRoutes.delete('/delete/:id',events.DeleteEvents)
eventRoutes.delete('/deleteimage/:id',events.DeleteEventImage)

module.exports = { projectRoutes, userRoutes,auditionRouts,eventRoutes };