//jshint esversion:6
const express = require("express");
const router = express.Router();
const manage = require("../routes/manage");
const category = require("../routes/category");
const { ensureAuthenticated } = require("../config/auth");
const { v4: uuidv4 } = require('uuid');

//model
const Post = require("../models/posts");
const { post } = require("../routes/manage");



//view single post
router.get("/singlepost/:id", function (req, res) {
    const id = req.params.id;

    Post.find({ _id: id }, function (err, posts) {
        res.render("singlepost", { posts: posts, currentUser: req.user });
    });
});

//get for user personal stories
router.get("/me/stories", ensureAuthenticated, function (req, res) {

    Post.find({ userId: req.user.id }, function (err, posts) {
        res.render("mystories", { posts: posts, currentUser: req.user, firstname: req.user.fname });
    });
});


//view all posts
router.get("/posts", function (req, res) {

    Post.find({}, function (err, posts) {
        if (err) {
            res.send("Uh Oh");
        } else {
            res.render("posts", { posts: posts, currentUser: req.user });
        }
    });
});

//post req for posts made by users
router.post("/compose", function (req, res) {
    const { jobtitle, jobdescription, jobcategory, joblevel } = req.body;
    const loggedUser = req.user.fname + " " + req.user.lname;
    const loggedUserId = req.user.id;
    let errors = [];

    if (!jobtitle || !jobdescription || !jobcategory || !joblevel) {
        errors.push({ msg: "Please fill all fields" });
    }

    if (jobdescription) {
        if (jobdescription.length > 2000) {
            errors.push({ msg: "Post is longer than 1000 characters" });
        }
    }

    if (errors.length > 0) {
        res.render("compose", {
            errors, jobtitle,
            jobdescription, jobcategory, currentUser: req.user
        });
    } else {

        const post = new Post({
            job_title: jobtitle,
            job_unique_id: uuidv4(),
            job_description: jobdescription,
            job_category: jobcategory,
            job_level: joblevel,
            name: loggedUser,
            userId: loggedUserId
        });

        post.save(function (err) {
            if (err) {
                errors.push("Your blog post did not save");
            } else {
                errors.push({ msg: "Blog post saved" });
                res.render("compose", { errors, jobtitle, jobdescription, jobcategory, joblevel, currentUser: req.user });
                //  res.redirect("/manage/compose");
            }
        });
    }

});

const hello = "hi";



//edit a post
router.post("/edit/:id", function (req, res) {
    const edit = req.params.id;
    console.log(req.params.id);
    const { jobtitle, jobdescription, jobcategory } = req.body;

    let errors = [];

    if (!jobtitle || !jobdescription || !jobcategory || !joblevel) {
        errors.push({ msg: "Please fill all fields" });
    }

    Post.updateOne({ _id: edit }, {
        jobtitle,
        jobdescription,
        jobcategory,
        joblevel
    }, { $set: req.body }, function (err) {
        if (err) {
            console.log("didnt update");
        } else {
            errors.push({ msg: "Blog post editted" });
            res.redirect("/articles/me/stories");
        }
    }

    );
});














module.exports = router;