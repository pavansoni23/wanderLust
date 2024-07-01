/*
    npm init -y
    npm i nodemon
    npm i express
    npm i ejs
    npm i mongoose
    npm i exress-session
    npm i connect-flash
    npm i passport 
    npm i passport-local
    npm i passport-local-mongoose
*/


// SETUP
const express = require("express");
const app = express();

app.set("view engine", "ejs");

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const mongoose = require("mongoose");
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');   // Database used is "wanderLust"
}   

// -------------------------------------------------------------------------------------------------------------------- //





// ---------------------------------------------------------------------------------------------------------------- //

const ExpressError = require("./utils/ExpressError.js");


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


const methodOverride = require("method-override");
app.use(methodOverride("_method"));




// express-session
const session = require("express-session");

const sessionOptions = {
    secret : "mySuperSecretCode",
    resave : false,
    saveUninitialized : true,

    cookie : {
        expires : Date.now() * 1000 * 60 * 60 * 24 * 7,          // 1 week tk cookie browser m save rhegi (No need to re-login for 1 week)
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true                                          // for security purpose
    }
}

app.use(session(sessionOptions));                   // will generate connect.sid cookie



// connect-flash
const flash = require("connect-flash");
app.use(flash());







// AUHTENTICATION

const User = require("./models/user.js"); 

const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());                                     //middleware toinitialize passport
app.use(passport.session());                                        // ek session p ek user ek hi baar login kre. Baar baar login na krna pdhe for same session.
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());                       // User related info. session m store hogi
passport.deserializeUser(User.deserializeUser());                   // After session ends , User related info remove hogi 









app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// ---------------------------------------------------------------------------------------------------------------- //



// Requiring routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// setting up parent route
app.use("/listings" , listingRouter);  // jitne bhi routes "/listings" s start ho rhe h , unkimapping "./routes/listing.js" wale folder m krdo.
app.use("/listings/:id/reviews" , reviewRouter);   
app.use("/" , userRouter);




// error-handling middleware 
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});


app.get("/", (req, res) => {
    res.send("I'm root");
});


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.listen(8080, () => {
    console.log("server is listening");
});

