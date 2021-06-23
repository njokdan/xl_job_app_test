//jshint esversion:6
const express = require("express");
const JobPost = require("../models/jobposts");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");


//compose a post
router.get("/compose", ensureAuthenticated, function (req, res) {
    res.render("compose", { currentUser: req.user });
});


//edit a post
router.get("/edit/:id", ensureAuthenticated, function (req, res) {
    const edit = req.params.id;
    JobPost.find({ _id: edit }, function (err, jobposts) {
        if (err) {
            res.send(err);
        } else {
            if (jobposts)
                res.render("edit", { jobposts: jobposts, currentUser: req.user});
        }

    });
});

//delete post
router.get("/delete/:id", ensureAuthenticated, function (req, res) {
    const edit = req.params.id;

    JobPost.deleteOne({ _id: edit }, function (err) {
        if (err) {
            res.send(err);
        } else {
            req.flash("success_msg", "JobPost deleted");
            res.redirect("/");
        }

    });
});


module.exports = router;