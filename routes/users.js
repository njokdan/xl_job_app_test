//jshint esversion:6
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const saltRounds = 10;

//model
const User = require("../models/User");


//user login
router.get("/signin", (req, res) => res.render("signin", { currentUser: req.user }));

//user register
router.get("/register", (req, res) => res.render("register", { currentUser: req.user }));

//user profile
router.get("/profile", ensureAuthenticated, (req, res) => res.render("profile",
  {
    firstname: req.user.fname,
    lastname: req.user.lname,
    email: req.user.email,
    currentUser: req.user
  }));

  //get req for user signout
router.get("/signout", function (req, res, next) {
  req.logout();
  req.flash("success_msg", "You are signed out");
  res.redirect("/users/signin");
});


// router.get("/error", (req, res) => res.render("error",));



//post req for user signin
router.post("/signin", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/signin",
    failureFlash: true
  })(req, res, next);
});

//registration password validation
router.post("/register", (req, res) => {

  const { fname, lname, email, password } = req.body;
  let errors = [];


  //if empty 
  if (!fname || !lname || !email || !password) {
    errors.push({ msg: 'Please fill all fields' });
  }
  //pass length
  if (password) {
    if (password.length < 6) {
      errors.push({ msg: 'Password should be more than 6 characters' });
    }
  }

  //if there are any errors, return to the register page
  if (errors.length > 0) {
    res.render('register', {
      errors,
      fname,
      lname,
      email,
      password
    });

  } else {

    //find the user
    User.findOne({ email: email }, function (foundUser) {

      if (foundUser) {
        errors.push({ msg: 'Email already registered' });
        res.render("register", {
          errors,
          fname,
          lname,
          email,
          password
        });
      } else {

        const newUser = new User({
          fname,
          lname,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/signin');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


module.exports = router;