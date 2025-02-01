const express = require('express');
const app = express();
const port = 3004;
const connectDB = require('./db/ConnectDB')
const web = require('./routing/web');
const flash  = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cookieparser = require('cookie-parser');



app.use(fileUpload({useTempFiles:true}))


connectDB()


// static file for images
app.use(express.static('public'))


 //parse application/x-www-form-urlencoded
 app.use(express.urlencoded({ extended: false }));




// messages

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}))
 

// flash messages
app.use(flash());


app.use(cookieparser());



// set up ejs 

app.set('view engine','ejs')



// route imports
app.use('/',web)



// run server 
app.listen(port,()=>{
     console.log(`server is running on port:${port}`)
})
