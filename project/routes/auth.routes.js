const express = require("express");
const router = express.Router();

// Encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Models
const User = require("../models/User.model");



router.get("/login", (req, res) =>{

    res.render("auth/login");

})

router.get("/signup", (req, res)=>{
    console.log(req.session);
    res.render("auth/signup");
})


router.post("/signup", (req, res) => {
    const newUser = req.body;
    const {name, email, password} = newUser;
    console.log(newUser);


    bcrypt.hash(password, saltRounds)
        .then(hashPassword =>{
            return User.create({
                name,
                email,
                password: hashPassword
            })
        .then(user => {
            res.redirect('/auth/login')
            })
        })
  
})


router.post("/login", (req, res) =>{

})


module.exports = router;