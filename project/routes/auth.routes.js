const express = require("express");
const router = express.Router();

// Encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Models
const User = require("../models/User.model");



router.get("/signin", (req, res) =>{

    res.render("auth/signin");

})

router.get("/register", (req, res)=>{
    console.log(req.session);
    res.render("auth/register");
})


module.exports = router;