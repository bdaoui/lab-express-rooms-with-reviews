const express = require("express");
const router = express.Router();

// Encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Models
const User = require("../models/User.model");
const cookieParser = require("cookie-parser");



router.get("/login", (req, res) =>{

    res.render("auth/login");

})

// Sigh UP

router.get("/signup", (req, res)=>{
    res.render("auth/signup");
})


router.post("/signup", (req, res) => {
    const newUser = req.body;
    const {name, email, password} = newUser;

    bcrypt.hash(password, saltRounds)
        .then(hashPassword =>{
            return User.create({
                name,
                email,
                password: hashPassword
            })
        .then(user => {
            req.session.user = user;
            res.redirect('/auth/profile')
            })
        })
  
})

// Log IN


router.post("/login", (req, res) =>{
    const loginData = req.body;
    const {name, password} = loginData;
    
    let theUser;

    User.find({name})
        .then(user =>{
            theUser = user;
            // console.log(user)
            // console.log("this is password ", password)
            // console.log("this is user.password ", user[0].password)
            return bcrypt.compare(password, user[0].password)
        }) 
        .then(correct =>{
            req.session.user = theUser;
            res.redirect('/auth/profile');
        })

        
})


router.get("/profile", (req, res)=>{
    if(req.session.user){
        const {user} = req.session;
        const result = user[0]
        res.render("auth/profile", {result})
    }
    
    else{
        res.render("auth/login")

    }
})


// Logout 

router.get("/logout", (req, res)=>{
    req.session.destroy(() =>{
        res.redirect('/auth/login')
      })
})


module.exports = router;