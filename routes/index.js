//jshint esversion:6
const express = require("express");
const router = express.Router();
const JobPost = require("../models/jobposts");
const { subscribe } = require("./manage");
const { ensureAuthenticated } = require("../config/auth");


//index page
router.get("/", function (req, res) {

    JobPost.find({}, function (err, jobposts) {
        res.render("index",
            { jobposts: jobposts, currentUser: req.user }
        );
    });
});

module.exports = router;