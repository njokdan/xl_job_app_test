//jshint esversion:6
const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const { ensureAuthenticated } = require("../config/auth");

//display content based on category search
router.get("/:category_id", function (req, res) {

    const category = req.params.category_id;

    Post.find({ category: category }, function (err, posts) {
        if (posts) {
                res.render("category", { posts: posts, currentUser: req.user, category});
            } 
        
    });
});

module.exports = router;