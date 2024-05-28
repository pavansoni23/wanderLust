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
}

app.use(express.static("public")); 
app.use(express.urlencoded({ extended: true }));




const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs" , ejsMate);

const Listing = require("./models/listing.js");









app.listen(8080, () => {
    console.log("server is listening");
});




app.get("/" , (req , res) => {
    res.send("I'm root");
});

// INDEX route
app.get("/listings" , async (req , res) => {
    const allListings = await Listing.find();

    res.render("listings/allListings.ejs" , {allListings});
});



// NEW route
app.get("/listings/new" , (req , res) => {
    res.render("listings/new.ejs");
});

app.post("/listings" , async (req, res) => {
    const data = req.body.listing;            // req.body k "listing" object ki details extract krega

    // console.log(data);

    const newListing = new Listing(data);

    await newListing.save();

    res.redirect("/listings");
});



// EDIT route
app.get("/listings/:id/edit" , async (req , res) => {
    let {id} = req.params;

    const listing = await Listing.findById(id);
    
    res.render("listings/edit.ejs" , {listing});
});


app.put("/listings/:id" , async (req , res) => {
    let {id} = req.params;

    await Listing.findByIdAndUpdate(id , {...req.body.listing});  // req.body.listing is an object . It is reconstructed to obtain indivisual {key:value} pairs

    res.redirect(`/listings/${id}`);
});



// SHOW route
app.get("/listings/:id" , async (req , res) => {
    let {id} = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/show.ejs" , {listing});
});



// DELETE route
app.delete("/listings/:id" , async (req , res) => {
    let {id} = req.params;
    
    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
});
