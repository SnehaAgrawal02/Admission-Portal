const UserModel=require('../models/user')
//to secure password
const cloudinary = require("cloudinary").v2
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const CourseModel = require('../models/course');


cloudinary.config({ 
    cloud_name: 'ddcnqvfum', 
    api_key: '385286778953337', 
    api_secret: 'GJp8nVwKCt8mfL-BDkGgRDf0egc' 
  });

class FrontController {
    static login=async(req,res)=>{
        try{
            // res.send("login")
            res.render('login',{message:req.flash('success'),msg:req.flash('error')});
        }
        catch(error){
            console.log(error)
        }
    }
    static register=async(req,res)=>{
        try{
            // res.send("login")
            res.render('register', {message:req.flash('error')});
        }
        catch(error){
            console.log(error)
        }
    }
    static home=async(req,res)=>{
        try{
            const{name,image,email,id}=req.userData
            const btech = await CourseModel.findOne({user_id:id,course:"btech"})
            const bca = await CourseModel.findOne({user_id:id,course:"bca"})
            const mca = await CourseModel.findOne({user_id:id,course:"mca"})
            res.render('home',{n:name, i:image,e:email, btech:btech,mca:mca,bca:bca})
        }
        catch(error){
            console.log(error)
        }
    }
    static about=async(req,res)=>{
        try{
            const{name,image}=req.userData
            res.render('about',{n:name, i:image})
        }
        catch(error){
            console.log(error)
        }
    }
   
    static contact=async(req,res)=>{
        try{
            const{name,image}=req.userData
            res.render('contact',{n:name,i:image})
        }
        catch(error){
            console.log(error)
        }
    }
    static userinsert = async (req, res) => {
        try {
            const file = req.files && req.files.image;
            if (!file) {
                req.flash('error', 'Please upload an image.');
                res.redirect('/register');
                return;
            }
    
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'userprofile'
            });
    
            const { n, e, p, cp } = req.body;
            const user = await UserModel.findOne({ email: e });
            
            if (user) {
                req.flash('error', 'User already exists.');
                res.redirect('/register');
                return;
            }
    
            if (!(n && e && p && cp)) {
                req.flash('error', 'All fields are required.');
                res.redirect('/register');
                return;
            }
    
            if (p !== cp) {
                req.flash('error', 'Passwords do not match.');
                res.redirect('/register');
                return;
            }
    
            const hashPassword = await bcrypt.hash(p, 10);
            const newUser = new UserModel({
                name: n,
                email: e,
                password: hashPassword,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            });
    
            await newUser.save();
    
            req.flash('success', 'Successfully registered. Please login.');
            res.redirect('/');
        } catch (error) {
            console.log(error);
            req.flash('error', 'An error occurred. Please try again.');
            res.redirect('/register');
        }
    }
    
    static verifyLogin = async (req, res) => {
        try{
            const {email , password} = req.body
            const user = await UserModel.findOne({email:email})
            if(user!=null){
                const isMatch = await bcrypt.compare(password , user.password)
                if(isMatch){
                    //Admin Login
                    if(user.role==='admin'){
                        const token = jwt.sign({ ID: user.id }, 'guptchabi@123456');
                        res.cookie('token',token)
                        res.redirect('/admin/dashboard')
                    }else{
                        // To Generate Token
                        const token = jwt.sign({ ID: user.id }, 'guptchabi@123456');
                        // console.log(token)
                        res.cookie('token',token)
                        res.redirect('/home')
                    }
                }else{
                    req.flash('error','Email or Password is Not Correct.')
                    res.redirect('/');
                }
            }else{
                req.flash('error','You are not a Registered User.')
                res.redirect('/');
            }
        }catch(err){
            console.log(err);
        }
    }
    static logOut=async(req,res)=>{
        try{
            res.clearCookie('token')
            res.redirect('/')
        }
        catch(error){
            console.log(error)
        }
    }
    static profile=async(req,res)=>{
        try{
           const {name,image,email,id}=req.userData
            res.render("profile",{n:name,i:image,e:email,})
        }
        catch(error){
            console.log(error)
        }
    }
    static updateProfile = async (req, res) => {
        
        try {
            const { id } = req.userData
            const {name,email} =req.body
            if (req.files) {
                const user = await UserModel.findById(id)
                const imageID = user.image.public_id
                // console.log(imageID)

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID)
                //new image update
                const imagefile = req.files.image
                const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
                    folder: 'userprofile'
                })
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email,
                    
                }
            }
            await UserModel.findByIdAndUpdate(id, data)
            req.flash('success', "Update Profile successfully")
            res.redirect('/profile')
            
            
        } catch(error) {
            console.log(error)
        }
    }
    static changePassword = async (req, res) => {
        
        try {
            const {id } = req.userData
            //console.log(req.body)
            const {op,np,cp} =req.body
            if (op && np && cp) {
                const user = await UserModel.findById(id)
                const isMatched = await bcrypt.compare(op, user.password)
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash('error', 'Current password is incorrect ')
                    res.redirect('/profile')
                } else {
                    if (np != cp) {
                        req.flash('error', 'Password does not match')
                        res.redirect('/profile')
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                        res.redirect('/')
                    }
                }
            } else {
                req.flash('error', 'ALL fields are required ')
                res.redirect('/profile')
            }


           
        } catch(error) {
            console.log(error)
        }
    }


}
module.exports= FrontController