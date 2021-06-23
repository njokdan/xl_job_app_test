//jshint esversion:6
const express = require("express");
const router = express.Router();
const manage = require("../routes/manage");
const category = require("../routes/jobcategory");
const { ensureAuthenticated } = require("../config/auth");
const { v4: uuidv4 } = require('uuid');

//model
const JobPost = require("../models/jobposts");
const { post } = require("../routes/manage");



//view single post
router.get("/singlejobpost/:id", function (req, res) {
    const id = req.params.id;

    JobPost.find({ _id: id }, function (err, jobposts) {
        res.render("singlejobpost", { jobposts: jobposts, currentUser: req.user });
    });
});

//get for user personal stories
// router.get("/me/stories", ensureAuthenticated, function (req, res) {

//     Post.find({ userId: req.user.id }, function (err, posts) {
//         res.render("mystories", { posts: posts, currentUser: req.user, firstname: req.user.fname });
//     });
// });

//view all posts based on category
router.get("/jobs/:category", function (req, res) {

    const jobcategory = req.params.category;

    JobPost.find({ job_category: jobcategory }, function (err, posts) {
        res.render("jobposts", { jobposts: jobposts, currentUser: req.user });
    });

});

//post req for posts made by users
router.post("/jobs", function (req, res) {
    const uid = uuidv4();
    //console.log(req.body);
    const { jobtitle, jobdescription, jobcategory, joblevel } = req.body;
    const loggedUser = req.user.fname + " " + req.user.lname;
    const loggedUserId = req.user.id;
    let errors = [];

    if (!jobtitle || !jobdescription || !jobcategory) {
        errors.push({ msg: "Please fill all fields" });
    }

    if (jobdescription) {
        if (jobdescription.length > 5000) {
            errors.push({ msg: "Post is longer than 3000 characters" });
        }
    }

    if (errors.length > 0) {
        res.render("compose", {
            errors, jobtitle,
            jobdescription, jobcategory, currentUser: req.user
        });
    } else {

        const post = new JobPost({
            job_title:jobtitle,
            job_unique_id: uid,
            job_description:jobdescription,
            job_category:jobcategory,
            job_level:joblevel,
            name: loggedUser,
            userId: loggedUserId
        });

        // const post = new JobPost({
        //     jobtitle,
        //     uid,
        //     jobdescription,
        //     jobcategory,
        //     joblevel,
        //     name: loggedUser,
        //     userId: loggedUserId
        // });
        //console.log("Post:",post);
        post.save(function (err) {
            if (err) {
                errors.push("Your jobpost did not save");
            } else {
                errors.push({ msg: "Jobpost saved" });
                res.render("compose", { errors, jobtitle, jobdescription, jobcategory, joblevel, currentUser: req.user });
                //  res.redirect("/manage/compose");
            }
        });
    }

});


//view all jobposts
router.get("/jobs", function (req, res) {

    JobPost.find({}, function (err, jobposts) {
        if (err) {
            res.send("Uh Oh");
        } else {
            console.log("From Db",jobposts);
            res.render("jobs", { jobposts: jobposts, currentUser: req.user });
        }
    });
});

//post req for posts made by users
router.post("/compose", function (req, res) {
    const { jobtitle, jobdescription, jobcategory, joblevel } = req.body;
    const loggedUser = req.user.fname + " " + req.user.lname;
    const loggedUserId = req.user.id;
    let errors = [];

    if (!jobtitle || !jobdescription || !jobcategory) {
        errors.push({ msg: "Please fill all fields" });
    }

    if (jobdescription) {
        if (jobdescription.length > 5000) {
            errors.push({ msg: "Post is longer than 3000 characters" });
        }
    }

    if (errors.length > 0) {
        res.render("compose", {
            errors, jobtitle,
            jobdescription, jobcategory, currentUser: req.user
        });
    } else {

        const post = new JobPost({
            job_title:jobtitle,
            job_unique_id: uuidv4(),
            job_description:jobdescription,
            job_category:jobcategory,
            job_level:joblevel,
            name: loggedUser,
            userId: loggedUserId
        });
        console.log("Post:",post);
        post.save(function (err) {
            if (err) {
                errors.push("Your jobpost did not save");
            } else {
                errors.push({ msg: "Jobpost saved" });
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
    const { jobtitle, jobdescription, jobcategory, joblevel } = req.body;

    let errors = [];

    if (!jobtitle || !jobdescription || !jobcategory) {
        errors.push({ msg: "Please fill all fields" });
    }

    Post.updateOne({ _id: edit }, {
        job_title:jobtitle,
        job_description:jobdescription,
        job_category:jobcategory
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