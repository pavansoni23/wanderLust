const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signupUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);

        // Jese hi signUp hoga , uss user ko logIn kra do
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to wanderLust");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}



module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
}



module.exports.login = async (req, res) => {     
    req.flash("success", "Welcome back");
    res.redirect("/listings");
}



module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out successfully");
        res.redirect("/listings");
    });
}