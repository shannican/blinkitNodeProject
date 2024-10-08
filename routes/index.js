const express = require('express')
const router = express.Router()

router.get('/',function(req,res){
    res.render("user_login")
})



module.exports = router