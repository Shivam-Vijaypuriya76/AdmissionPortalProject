const jwt = require('jsonwebtoken');


const authoRoles = (roles)=>{
      return (req,res,next)=>{
          if(!roles.includes(req.userdata.role)){
            req.flash('error', 'Unauthorize user Please ')
            res.redirect('/')
          }
          next()
      }
}

module.exports = authoRoles;