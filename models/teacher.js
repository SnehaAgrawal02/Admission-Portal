const mongoose= require('mongoose')

const TeacherSchema= new mongoose.Schema({
    name:{
        type: String,
        Required:true
    }
},{timestamps:true})

const TeacherModel = mongoose.model('Teacher',TeacherSchema)
module.exports=TeacherModel