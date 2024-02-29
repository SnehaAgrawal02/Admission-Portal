const mongoose=require('mongoose')
const liveUrl = 'mongodb+srv://sneha:sneha@cluster0.zc0qzkx.mongodb.net/AdmissionPortal?retryWrites=true&w=majority&appName=Cluster0';



const connectDb=()=>{
    return mongoose.connect(liveUrl)
    .then(()=>{
        console.log("connected sucessfully");
    }).catch((err)=>{
        console.log(err);
    })
}
module.exports=connectDb