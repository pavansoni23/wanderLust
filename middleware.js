module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){                                          // if user is not logged-in
        req.flash("error" , "you must be logged in to create listing");
        return res.redirect("/login");
    }

    next();
};