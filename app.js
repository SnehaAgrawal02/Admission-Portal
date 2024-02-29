const express=require('express')
//console.log(express)
const app=express()
const port=3000
const web= require("./routes/web")
const connectDb= require("./db/dbcon.js")
// cookies
const cookieparser = require('cookie-parser')
app.use(cookieparser()) //used to get token

//file upload
const fileUpload = require('express-fileupload')

//Tempfiles uploaderz
app.use(fileUpload({useTempFiles:true}))

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');

//messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }));
//Flash messages
app.use(flash());

//to get data
app.use(express.urlencoded({extended:false}))

//connection of database
connectDb()

//used to link css and image
app.use(express.static('public'))

//template engines (HTML CSS)
app.set('view engine', 'ejs')

//router load http://localhost:3000/ (/)
app.use('/',web)





//route localhost:3000('/')
app.get('/', (req,res)=> {
    res.send("home page")
})
// localhost:3000/about
app.get('/about', (req,res)=> {
    res.send("about page")
})
// localhost:3000/team
app.get('/team', (req,res)=> {
    res.send("team page")
})

//server create
app.listen(port, () => console.log("Server is Running localhost:3000"))