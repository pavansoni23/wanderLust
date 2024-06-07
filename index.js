/*
    npm init -y
    npm i nodemon
    npm i express
    npm i ejs
    npm i mongoose
*/

const express = require("express");
const app = express();

app.set("view engine", "ejs");

const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}   // Database used is "wanderLust"


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));




const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);





// Requiring routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


const ExpressError = require("./utils/ExpressError.js");







app.get("/", (req, res) => {
    res.send("I'm root");
});




 
app.use("/listings" , listings);
app.use("/listings/:id/reviews" ,reviews);




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});




app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("server is listening");
});

