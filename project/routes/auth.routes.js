const express = require("express");
const router = express.Router();

// Encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Models
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const { find } = require("../models/User.model");



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
        .catch(err => console.log(err))

        .then(user => {
            let theUser;
            req.session.user = theUser;
            res.redirect('/auth/profile', {theUser})
            })
        })
        .catch(err => console.log(err))


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
            console.log("this is user.password ", user[0].password)
            return bcrypt.compare(password, user[0].password)
        })

        .then(correct =>{
            req.session.user = theUser;
            res.redirect('/auth/profile');
        })
        .catch(err => console.log(err))


})

// Profile


router.get("/profile", (req, res)=>{

    Room.find()
        .then(rooms =>{
            if(req.session.user){
                const {user} = req.session;
                const theUser = user[0]
                Room.find()
                res.render("auth/profile", {theUser, rooms})

            }

            else{
                res.render("auth/profile", {rooms})

            }
        })
        .catch(err => console.log(err))


})

// Create Room


router.post("/profile", (req, res) =>{
    const roomData = req.body;
    const {name, description, imageUrl} = roomData;

    const owner = req.session.user[0]._id

    return Room.create({
        name,
        description,
        imageUrl,
        owner
    })
    .then(room =>{
        res.redirect('/auth/profile')
    })
    .catch(err => console.log(err))


})



router.get("/newroom", (req, res)=>{
    res.render("auth/newroom")
})


// Modding Room

router.get("/:id/edit", (req, res)=>{
    const {id} = req.params;

    Room.findOne({_id: id})
        .populate("owner")
        .then(response =>{
            let check = false;
            // Check if I can mod them
            console.log(response)
            if(req.session.user){
                const user = req.session.user[0]._id;
                const owner = response.owner._id.toString();
                check = owner === user ? true : false;
                // console.log("this is owner", owner, "this is user", user)

            }

            res.render('auth/edit', {response, check})

        })
        .catch(err => console.log(err))




})


router.post("/:id/edit", (req, res)=>{
    console.log("hi this is working")
    const roomData = req.body;
    const {id} = req.params;
    const {name, description, imageUrl} = roomData;

    Room.findOneAndUpdate({id},{name, description,imageUrl}, {new: true})
        .then(result =>{
            res.redirect('/auth/profile')
        })
        .catch(err => console.log(err))


})

//Logout

router.get("/logout", (req, res)=>{
    req.session.destroy(() =>{
        res.redirect('/auth/login')
      })
})


module.exports = router;