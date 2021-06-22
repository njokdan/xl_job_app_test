//jshint esversion:6
const express = require("express");
const router = express.Router();
const manage = require("../routes/manage");
const category = require("../routes/category");
const { ensureAuthenticated } = require("../config/auth");

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
    const { title, content, category } = req.body;
    const loggedUser = req.user.fname + " " + req.user.lname;
    const loggedUserId = req.user.id;
    let errors = [];

    if (!title || !content || !category) {
        errors.push({ msg: "Please fill all fields" });
    }

    if (content) {
        if (content.length > 2000) {
            errors.push({ msg: "Post is longer than 1000 characters" });
        }
    }

    if (errors.length > 0) {
        res.render("compose", {
            errors, title,
            content, category, currentUser: req.user
        });
    } else {

        const post = new Post({
            title,
            content,
            category,
            name: loggedUser,
            userId: loggedUserId
        });

        post.save(function (err) {
            if (err) {
                errors.push("Your blog post did not save");
            } else {
                errors.push({ msg: "Blog post saved" });
                res.render("compose", { errors, title, content, category, currentUser: req.user });
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
    const { title, content, category } = req.body;

    let errors = [];

    if (!title || !content || !category) {
        errors.push({ msg: "Please fill all fields" });
    }

    Post.updateOne({ _id: edit }, {
        title,
        content,
        category
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