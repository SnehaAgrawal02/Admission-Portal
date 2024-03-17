const express= require("express")
const FrontController=require("../controllers/FrontController")
const CourseController = require('../controllers/CourseController');
const AdminController = require('../controllers/AdminController');
const route=express.Router()
const checkUserAuth=require('../middleware/auth')
const islogin=require('../middleware/islogin')
const adminRole = require('../middleware/adminRole');

//routing
route.get('/',islogin, FrontController.login)
route.get('/register',FrontController.register)
route.get('/home',checkUserAuth ,FrontController.home)
route.get('/about',checkUserAuth,FrontController.about)
route.get('/contact',checkUserAuth,FrontController.contact)

route.post('/userinsert',FrontController.userinsert)
route.post('/verifyLogin',FrontController.verifyLogin)
route.get('/logOut',FrontController.logOut)

//profile update
route.get('/profile',checkUserAuth,FrontController.profile)
route.post('/updateProfile',checkUserAuth,FrontController.updateProfile)
route.post('/changePassword',checkUserAuth,FrontController.changePassword)

//Course Route
route.post("/course_insert",checkUserAuth , CourseController.courseInsert)
route.get("/course_display",checkUserAuth , CourseController.courseDisplay)
route.get("/courseView/:id",checkUserAuth , CourseController.courseView)
route.get("/courseEdit/:id",checkUserAuth , CourseController.courseEdit)
route.post("/courseUpdate/:id",checkUserAuth , CourseController.courseUpdate)
route.get("/courseDelete/:id",checkUserAuth , CourseController.courseDelete)

//admin Route

route.get('/admin/dashboard',checkUserAuth , adminRole('admin') ,AdminController.dashboard)
route.post('/update_status/:id',checkUserAuth, AdminController.updateStatus)
route.get('/admin/adminAbout',checkUserAuth, AdminController.about)
route.get('/admin/adminContact',checkUserAuth, AdminController.contact)



//password
route.post('/forgot_password',FrontController.forgotPasswordVerify)
route.get('/reset-password',FrontController.resetPassword)
route.post('/reset_Password1',FrontController.reset_Password1)
route.get('/verify',FrontController.verify)

module.exports = route