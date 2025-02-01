const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');



const checkAuth = async(req,res,next)=>{
      const {token} = req.cookies;

      if(!token){
        req.flash('error','Unauthorize user Please Login');
        res.redirect('error')
      }else{
          const verifyToken = jwt.verify(token,"dscfgvhbjnkmmh");
          const data = await UserModel.findOne({_id: verifyToken.ID});
          req.userdata = data;
          next();
      }
}

module.exports = checkAuth;