const ContactModel = require("../../models/contact")
const CourseModel = require("../../models/course")
const UserModel = require("../../models/user")
const bcrypt = require('bcrypt')

class AdminController{
    static dashboard = async(req,res)=>{
        try {
          res.render('admin/dashboard')
        } catch (error) {
  console.error('Dashboard render error:', error);
  res.status(500).send('Internal Server Error');
}
    }

    static studentDisplay = async(req,res)=>{
       try {
         const {image} = req.userdata;
         const data = await UserModel.find();
         res.render('admin/studentDisplay',{d:data,i:image})
       } catch (error) {
        console.log(error);
       }
    }

    static studentView = async(req,res)=>{
        try {
           const data = await UserModel.findById(req.params.id);
           res.render('admin/studentView',{d:data})
        } catch (error) {
          console.log(error)
        }
    }

    static studentEdit = async(req,res)=>{
        try {
          const data = await UserModel.findById(req.params.id);
          res.render('admin/studentEdit',{d:data})
        } catch (error) {
          console.log(error)
        }
    }

    static studentUpdate = async(req,res)=>{
        try {
          let id = req.params.id;
          const {name,email,password} = req.body;
          await UserModel.findByIdAndUpdate(id,{
            name,
            email,
            password
          })
          res.redirect('/admin/studentDisplay')
        } catch (error) {
          console.log(error);
        }
    }
      static studentDelete = async(req,res)=>{
          try {
            const data = await UserModel.findByIdAndDelete(req.params.id);
            res.redirect('/admin/courseDisplay');
          } catch (error) {
            console.log(error)
          }
      }

        static courseDisplay = async(req,res)=>{
            try {
              const {name,image} = req.userdata;
              const course = await CourseModel.find();
              res.render('admin/courseDisplay',{c:course, n:name, i:image})
            } catch (error) {
              console.log(error);
            }
        }

         static update_status = async(req,res)=>{
            try {
               let id = req.params.id;
               const {status,comment} = req.body;
               await CourseModel.findByIdAndUpdate(id,{
                status,
                comment
               })
              //  this.sendEmail(name, email, course, status, comment)
               res.redirect('/admin/courseDisplay')
            } catch (error) {
              console.log(error);
            }
         }

      //    static sendEmail = async (name, email, course, status, comment) => {
      //     // console.log(name,email,course)
      //     // connenct with the smtp server
  
      //     let transporter = await nodemailer.createTransport({
      //         host: "smtp.gmail.com",
      //         port: 587,
  
      //         auth: {
      //           user: "vijaypuriyashivam@gmail.com",
      //             pass: "twhbndrgmpeojlew"
      //         },
      //     });
      //     let info = await transporter.sendMail({
      //         from: "test@gmail.com", // sender address
      //         to: email, // list of receivers
      //         subject: ` Course ${course} ${status}`, // Subject line
      //         text: "heelo", // plain text body
      //         html: `<b>${name}</b> Course  <b>${course} ${status}</b> ${comment} <br>
      //          `, // html body
      //     });
      // };

         static contactDisplay = async(req,res)=>{
            try {
              const {name,image} = req.userdata;
              const data = await ContactModel.find();
              res.render('admin/contactDisplay',{d:data, n:name, i:image})
            } catch (error) {
              console.log(error)
            }
         }

         static profile = async(req,res)=>{
            try {
              const {name,image,email,id} = req.userdata;
              res.render('admin/profile',{n:name,i:image,e:email,msg: req.flash('success'),message:req.flash('error') })
            } catch (error) {
              console.log(error);
            }
         }

           static updateProfile = async(req,res)=>{
              try {
                const {id} = req.userdata;
                const {name,email,role} = req.body;
                if(req.files){
                   const user = await UserModel.findById(id);
                   const imageID = user.image.public_id;

                   // delete image from cloudinary 
                    await cloudinary.uploader.destroy(imageID);
                    // new Image Update 
                      const imagefile = req.files.image;
                      const imageUpload = await cloudinary.uploader.upload(imagefile.tempFilePath,{
                        folder:'userprofile'
                      });
                         var data = {
                          name:name,
                          email:email,
                          image:{
                            public_id: imageUpload.public_id,
                            url:imageUpload.secure_url,
                          }
                         }
                }else{
                  var data = {
                    name: name,
                    email: email,
                };
                }
                await UserModel.findByIdAndUpdate(id, data);
                req.flash("success", "Update Profile successfully");
                res.redirect("/admin/profile");
              } catch (error) {
                console.log(error);
              }
           }

             static password = async(req,res)=>{
                try {
                  const {name,image} = req.userdata;
                  res.render('admin/password', {n:name,i:image})
                } catch (error) {
                  console.log(error);
                }
             }

               static changePassword = async(req,res)=>{
                  try {
                    const {id} = req.userdata;
                    const {op,np,cp} = req.body;
                    if(op && np && cp) {
                       const user = await UserModel.findById(id);
                       const isMatched = await bcrypt.compare(op,user.password);

                       if(!isMatched){
                        req.flash("error", "Current password is incorrect ");
                        res.redirect("/profile");
                       }else{
                        if(np != cp){
                          req.flash("error", "Password does not match");
                          res.redirect("/profile");
                        }
                        else{
                          const newHashPassword = await bcrypt.hash(np, 10);
                          await UserModel.findByIdAndUpdate(id, {
                              password: newHashPassword,
                          });
                          req.flash("success", "Password Updated successfully ");
                          res.redirect("/logout");
                        }
                       }
                    }else{
                      req.flash("error", "ALL fields are required ");
                      res.redirect("/profile");
                    }
                  } catch (error) {
                    console.log(error);
                  }
               }
}

module.exports = AdminController