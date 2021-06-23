//jshint esversion:6
require('dotenv').config();
const express = require("express");
var cors = require('cors');
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const multer = require("multer");
const gridfsStorage = require("multer-gridfs-storage");
const path = require("path");
const grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");

const app = express();
app.use(cors());

//passport config
require('./config/passport')(passport);

//db config
const db = require("./config/key").MongoURI;


//connect to mongoose
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("mongo connected"))
.catch(err => {
  console.log(err);

  redirect("/users/error");

});


//ejs 
app.use(expressLayout);
app.use(methodOverride('method'));
app.set('view engine', 'ejs');


//body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));


//express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  }));
  
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//global vars for flash
app.use(function(req, res, next){
res.locals.success_msg = req.flash("success_msg");
res.locals.error_msg = req.flash("error_msg");
res.locals.error = req.flash("error");
next();
});

app.use("/", require("./routes/index"));//for users - applicants
app.use("/users", require("./routes/users"));

//Jobs
app.use("/jobs", require("./routes/jobs"));


//Admin
app.use("/admin", require("./routes/admin"));
// app.use("/createjob", require("./routes/createjob"));
// app.use("/getalljobs", require("./routes/getalljobs"));




app.use("/articles", require("./routes/articles"));


app.use("/category", require("./routes/category"));

app.use("/manage", require("./routes/manage"));


const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log("server started on" + " " + PORT));