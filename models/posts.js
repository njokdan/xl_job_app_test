//jshint esversion:6
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    
title: {
    type: String,
    required: true
},

content: {
    type: String,
    required: true
},

date: {
    type: Date,
    default: new Date()
},

category: {
    type: String,
    required: true
},

name: {
    type: String,
    required: true
},

userId: {
    type: String,
    required: true
}

}); 

// const OptionSchema = new mongoose.Schema({
// category: {
//     type: String,
//     required: true
// }
// });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
// const Option = mongoose.model('Option', OptionSchema);
// module.exports = Option;
