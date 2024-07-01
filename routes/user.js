const express = require("express");
const { route } = require("./listing");
const router = express.Router();

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


// signup (GET -> POST)
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});


router.post("/signup", wrapAsync(async (req, res) => {
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
}));




// login (GET -> POST)
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


router.post("/login",
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {   // passport.authenticate() is a middleware used to check whether a user is already present in the database or not  
        req.flash("success", "Welcome back");
        res.redirect("/listings");
    });





// logOut
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out successfully");
        res.redirect("/listings");
    });
});

module.exports = router;