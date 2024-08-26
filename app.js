const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const expressSession = require('express-session')
const path =  require('path')


require("dotenv").config()
require("./config/google_oauth")
require('./config/db')

app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret: process.env.SESSION_SECRET,
    })
)



app.use('/',indexRouter)
app.use('/auth',authRouter)


app.listen(3000)