const express = require('express');
const FrontController = require('../controllers/FrontController');
const checkAuth = require('../middleware/auth');
const CourseController = require('../controllers/CourseController');
const ContactContoller = require('../controllers/ContactController');
const AdminController = require('../controllers/admin/AdminController');
const adminrole = require('../middleware/adminrole');

const route = express.Router();


// FrontController Route
route.get('/home', checkAuth, FrontController.home)
route.get('/about', checkAuth, FrontController.about)
route.get('/contact', checkAuth, FrontController.contact)



route.get('/', FrontController.login)
route.get('/register', FrontController.register)
route.post('/insertStudent', FrontController.insertstudent)
route.post('/verifyLogin', FrontController.verifyLogin)
route.get('/logout', FrontController.logout)


// CourseController Route 

route.post('/course_insert', checkAuth, CourseController.courseInsert)
route.get('/coursedisplay',checkAuth,CourseController.coursedisplay)
route.get('/courseView/:id',checkAuth,CourseController.courseview)
route.get("/courseEdit/:id", checkAuth, CourseController.courseEdit)
route.post("/courseUpdate/:id", checkAuth, CourseController.courseUpdate)
route.get("/courseDelete/:id", checkAuth, CourseController.courseDelete)


// contactcontoller
route.post('/contact_insert', checkAuth, ContactContoller.contactinsert)



// profile

route.get('/profile', checkAuth, FrontController.profile)
route.post('/changePassword', checkAuth, FrontController.changePassword)
route.post('/updateProfile', checkAuth, FrontController.updateProfile)



// Admin Route 
route.get('/admin/dashboard',checkAuth,adminrole('admin'),AdminController.dashboard)
route.get('/admin/studentDisplay',checkAuth,adminrole('admin'),AdminController.studentDisplay)
route.get('/admin/studentView/:id',checkAuth,adminrole('admin'),AdminController.studentView)
route.get('/admin/studentEdit/:id',checkAuth,adminrole('admin'),AdminController.studentEdit)
route.post('/admin/studentUpdate/:id',checkAuth,adminrole('admin'),AdminController.studentUpdate)
route.get('/admin/studentDelete/:id',checkAuth,adminrole('admin'),AdminController.studentDelete)
route.get('/admin/courseDisplay', checkAuth,adminrole('admin'), AdminController.courseDisplay)
route.post('/update_status/:id', checkAuth,adminrole('admin'), AdminController.update_status)
route.get('/admin/contactdisplay', checkAuth,adminrole('admin'), AdminController.contactDisplay)
route.get('/admin/profile', checkAuth,adminrole('admin'), AdminController.profile)
route.post('/admin/updateProfile', checkAuth, adminrole('admin'), AdminController.updateProfile)
route.get('/admin/password', checkAuth,adminrole('admin'), AdminController.password)


// forget password
route.post('/forgot_Password',FrontController.ForgetPasswordVerify)
route.get('/reset_password', FrontController.reset_Password);
route.post('/reset_Password1', FrontController.reset_Password1)


route.get('/verify',FrontController.verifyMail)


module.exports = route;