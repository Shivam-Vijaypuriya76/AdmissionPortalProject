const CourseModel = require("../models/course");
const nodemailer = require('nodemailer')
class CourseController{

  
      static courseInsert = async(req,res)=>{
           try {
            const {id} = req.userdata;
            const {name,email,phone,dob,address,gender,education,course} = req.body;

            const result = new CourseModel({
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                gender:gender,
                address:address,
                education:education,
                course:course,
                user_id:id
            })
            await result.save()
            this.sendEmail(name,email,course) // this class tb use krte hai jb ek funtion ke andar dusra function call krna ho
            res.redirect('/home')

           } catch (error) {
            console.log(error);
           }
      }


      static sendEmail = async (name, email, course) => {
        // console.log(name,email,course)
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
           subject: ` Course ${course}`, // Subject line
           text: "heelo", // plain text body
           html: `<b>${name}</b> Course  <b>${course}</b> insert successful! <br>
            `, // html body
       });
     
      };

      static coursedisplay = async(req,res)=>{
        try {
           const {name,image,id} = req.userdata;
           const course = await CourseModel.find({user_id:id});
           res.render('course/display', {c:course, n:name, i:image,message: req.flash('success') })
        } catch (error) {
          console.log(error)
        }
     }

     static courseview = async(req,res)=>{
        try {
           const{name,image,role} = req.userdata;
           const data = await CourseModel.findById(req.params.id);
           res.render('course/view',{ n: name, i: image, d: data, r: role })
        } catch (error) {
           console.log(error)
        }
      }
             
      static courseEdit = async(req,res)=>{
        try {
           const {name,image,role} = req.userdata;
           const data = await CourseModel.findById(req.params.id);
           res.render('course/edit', { n: name, i: image, d: data, r: role })
        } catch (error) {
           console.log(error)
        }
      }

      static courseUpdate = async(req,res)=>{
        try {
           const {name,email,phone,dob,address,gender,education,course} = req.body;
           await CourseModel.findByIdAndUpdate(req.params.id,{
              name:name,
              email:email,
              phone:phone,
              dob:dob,
              gender:gender,
              address:address,
              education:education,
              course:course
           })
           req.flash('success', 'Course Update Successfully.')
           res.redirect('/coursedisplay')
        } catch (error) {
          console.log(error)
        }
   }

   static courseDelete = async (req, res) => {
    try {
        //console.log(req.params.id)
        const { name, image } = req.userdata
        await CourseModel.findByIdAndDelete(req.params.id)
        //console.log(data)
        req.flash('success', 'Course Delete Successfully.')
        res.redirect('/coursedisplay')
    } catch (error) {
        console.log(error)
    }
}

}


module.exports = CourseController;