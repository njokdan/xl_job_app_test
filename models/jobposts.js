//jshint esversion:6
const mongoose = require("mongoose");

const JobPostSchema = new mongoose.Schema({
    
job_title: {
    type: String,
    required: true
},

job_unique_id: {
    type: String,
    required: true
},

job_description: {
    type: String,
    required: true
},

job_category: {
    type: String,
    required: true
},

job_level: {
    type: String,
    required: true
},

date: {
    type: Date,
    default: new Date()
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

const JobPost = mongoose.model('JobPost', JobPostSchema);
module.exports = JobPost;
// const Option = mongoose.model('Option', OptionSchema);
// module.exports = Option;
