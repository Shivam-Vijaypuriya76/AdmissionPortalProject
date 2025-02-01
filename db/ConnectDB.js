const mongoose = require('mongoose');
const live_url = "mongodb+srv://shivamvijay:WtfpFNki622pfx9F@cluster0.zbshhd5.mongodb.net/AdmissionPortalProject?retryWrites=true&w=majority&appName=Cluster0"


const connectDB = ()=>{
    return mongoose.connect(live_url)
    .then(()=>{
         console.log('MongoDB Connected')
    })
    .catch((error)=>{
         console.log(error)
    })
}

module.exports = connectDB