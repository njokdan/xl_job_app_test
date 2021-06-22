//jshint esversion:6
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/adminAuth");
const saltRounds = 10;

//model
const Admin = require("../models/Admin");


//user login
router.get("/admin", (req, res) => res.render("home", { currentUser: req.user }));
router.get("/admin/signin", (req, res) => res.render("admin_signin", { currentUser: req.user }));

//user register
router.get("/admin/register", (req, res) => res.render("admin_register", { currentUser: req.user }));

//user profile
router.get("/admin/profile", ensureAuthenticated, (req, res) => res.render("admin_profile",
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

        const newUser = new Admin({
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