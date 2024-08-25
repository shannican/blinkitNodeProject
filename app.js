const express = require('express')
const app = express()
const indexRouter = require('./routes/index')

require("dotenv").config()
require('./config/db')

app.use('/',indexRouter)

app.listen(3000)