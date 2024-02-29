const jwt=require('jsonwebtoken');
const UserModel=require('../models/user');
const checkUserAuth=async(req,res,next)=>{
    // console.log('hello middleware');
    const{token}=req.cookies
    // console.log(token)
    if(!token){
        req.flash('error', 'Unauthorised user please login')
        res.redirect('/')
    }
    else{
        const verifyLogin=jwt.verify(token,'guptchabi@123456')
        // console.log(verifyLogin)
        const data = await UserModel.findOne({_id:verifyLogin.ID})
        // console.log(data)
        req.userData= data

        next();
    }
}
module.exports =checkUserAuth
