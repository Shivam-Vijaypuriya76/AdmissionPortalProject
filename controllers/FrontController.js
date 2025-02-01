const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const CourseModel = require("../models/course");
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');



cloudinary.config({
  cloud_name: "deiavo7za",
  api_key: "242548111216786",
  api_secret: "qGvxbLck841NNo0z_n7c6MNlj4k",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      const { name, image, email } = req.userdata;
      res.render("contact", {
        n: name,
        i: image,
        e: email,
        message: req.flash("success"),
        msg: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("register", {
        msg: req.flash("error"),
        message: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("login", {
        message: req.flash("success"),
        msg: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static insertstudent = async (req, res) => {
    try {
      const { name, email, password, confirmpassword } = req.body;
      if (!name || !email || !password || !confirmpassword) {
        res.flash("error", "All Filds are Require.");
        return res.redirect("/register");
      }

      const isEmail = await UserModel.findOne({ email });
      //console.log(isEmail)
      if (isEmail) {
        req.flash("error", "Email Already Exists");
        return res.redirect("/register");
      }
      if (password != confirmpassword) {
        req.flash("error", "password does not match");
        return res.redirect("/register");
      }

      //console.log(req.files);
      // image Upload
      const file = req.files.image;

      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload);
      const hashpassword = await bcrypt.hash(password, 10);
      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });

      if(data){
        let token = jwt.sign({ ID: data._id }, "dscfgvhbjnkmmh");
        //       //console.log(token)
             res.cookie("token", token);
             this.sendVerifymail(name, email, data._id);
                   //To redirect to login page
                   req.flash(
                     "success",
                     "Your Registration has been successfully.Please verify your mail."
                   );
                 return  res.redirect("/register");

      }
      else{
        req.flash("error", "Not Register.");
         res.redirect("/register");
      }

     
     
      req.flash("success", "register success ! plz Login");
      res.redirect("/"); //route web
    } catch (error) {
      console.log(error);
    }
  };


  static sendVerifymail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "vijaypuriyashivam@gmail.com",
          pass: "twhbndrgmpeojlew"
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3004/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };


  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });

      if (user != null) {
        const isMatched = await bcrypt.compare(password, user.password);

        if (isMatched) {
            if (user.role == "admin") {
                const token = jwt.sign({ ID: user._id }, "dscfgvhbjnkmmh");
                res.cookie("token", token);
                res.redirect("/admin/dashboard");
              }

              if (user.role == "student") {
                // token create
    
                const token = jwt.sign({ ID: user._id }, "dscfgvhbjnkmmh");
                res.cookie("token", token);
                res.redirect("/home");
              }

        } else {
          req.flash("error", "Email or Password is not valid");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not a registered user");
        return res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  // profile update and change password
  static profile = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };


    static updateProfile = async(req,res)=>{
           try {
            const { id } = req.userdata;
            const { name, email, role } = req.body;
            if (req.files) {
                const user = await UserModel.findById(id);
                const imageID = user.image.public_id;
                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID);
                //new image update
                const imagefile = req.files.image;
                const imageupload = await cloudinary.uploader.upload(
                  imagefile.tempFilePath,
                  {
                    folder: "userprofile",
                  }
                );
                var data = {
                  name: name,
                  email: email,
                  image: {
                    public_id: imageupload.public_id,
                    url: imageupload.secure_url,
                  },
                };
              } else {
                var data = {
                  name: name,
                  email: email,
                };
              }
              await UserModel.findByIdAndUpdate(id, data);
              req.flash("success", "Update Profile successfully");
              res.redirect("/profile");
           } catch (error) {
            console.log(error);
           }
    }


    static ForgetPasswordVerify = async(req,res)=>{
        try {
           const {email} = req.body;
           const userdata = await UserModel.findOne({email:email});
           if (userdata) {
            const randomString = randomstring.generate();
            await UserModel.updateOne(
              { email: email },
              { $set: { token: randomString } }
            );
            this.sendEmail(userdata.name, userdata.email, randomString);
            req.flash("success", "Plz check mail to reset your password");
            res.redirect("/");
          } else {
            req.flash("error", "you are not a registered Email");
            res.redirect("/");
          }
        } catch (error) {
         console.log(error);
        }
     }


     static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server
      
        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
      
            auth: {
                user: "vijaypuriyashivam@gmail.com",
                pass: "twhbndrgmpeojlew"
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "heelo", // plain text body
            html:
                "<p>Hii " +
                name +
                ',Please click here to <a href="http://localhost:3004/reset_password?token=' +
                token +
                '">Reset</a>Your Password.',
        });
      };
      

      static reset_Password = async (req, res) => {
        try {
            const token = req.query.token;
            const tokenData = await UserModel.findOne({ token: token });
            if (tokenData) {
                res.render("reset-password", { user_id: tokenData._id });
            } 
            else{
               res.render("404")
            }
        } catch (error) {
            console.log(error);
        }
      };


      static reset_Password1 = async (req, res) => {
        try {
            const { password, user_id } = req.body;
            const newHashPassword = await bcrypt.hash(password, 10);
            await UserModel.findByIdAndUpdate(user_id, {
                password: newHashPassword,
                token: "",
            });
            req.flash("success", "Reset Password Updated successfully ");
            res.redirect("/");
        } catch (error) {
            console.log(error);
        }
      };
      
      

}

module.exports = FrontController;
