 //jshint esversion:6
 const mongoose = require("mongoose");

 const AdminSchema = new mongoose.Schema({
 fname: {
     type: String,
     required: true
 },
 
 lname: {
     type: String,
     required: true
 },
 
 email: {
     type: String,
     required: true
 },
 
 password: {
     type: String,
     required: true
 },
 
 date: {
     type: Date,
     default: Date.now
 }
 
 }); 
 
 const Admin = mongoose.model('Admin', AdminSchema);
 module.exports = Admin;