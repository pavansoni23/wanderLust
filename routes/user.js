const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/users.js");


// signup (GET -> POST)
router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signupUser));



// login (GET -> POST)
router.route("/login")
    .get(userController.loginForm)
    .post(passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);
    // passport.authenticate() is a middleware used to check whether a user is already present in the database or not



// logOut
router.get("/logout", userController.logout);

module.exports = router; 