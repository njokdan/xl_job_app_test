module.exports = {
    ensureAuthenticated: function (req, res, next) {
    if(req.isAuthenticated()){
       return next();
    }
   req.flash("success_msg", "Please sign in to view");
   res.redirect("/users/signin");
    }

};