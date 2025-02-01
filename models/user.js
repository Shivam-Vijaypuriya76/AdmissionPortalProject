const mongoose = require('mongoose');
const { type } = require('os');

// define schema 

const UserSchema  = new mongoose.Schema({
     name:{
        type:String,
        require:true
     },
     email:{
        type:String,
        require:true
     },
     password:{
        type:String,
        require:true
     },
     role:{
        type:String,
        default:'student'
     },
     image:{
        public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true
        }
     },
     token:{
        type:String
     },
     is_verified: {
      type: Number,
      default: 0,
    },
},{timestamps:true})

// create collection

const UserModel = mongoose.model('user',UserSchema);

module.exports = UserModel;