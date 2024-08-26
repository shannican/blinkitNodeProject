const express = require('express')
const router = express.Router()
const { adminModel } = require('../models/admin')

if(
    typeof process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV === "DEVELOPMENT"
){
    router.get('/admin/create',function(req,res){

    })
}

module.exports = router