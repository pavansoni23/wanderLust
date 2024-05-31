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
app.engine("ejs", ejsMate);

const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schemaValidation.js")










app.get("/", (req, res) => {
    res.send("I'm root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// INDEX route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();

    res.render("listings/allListings.ejs", { allListings });
}));



// NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res) => {

        const data = req.body.listing;            // req.body k "listing" object ki details extract krega

        const newListing = new Listing(data);

        await newListing.save();

        res.redirect("/listings");
    }));



// EDIT route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });
}));



// UPDATE route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });  // req.body.listing is an object . It is reconstructed to obtain indivisual {key:value} pairs

        res.redirect(`/listings/${id}`);
    }));



// SHOW route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/show.ejs", { listing });
}));



// DELETE route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}));


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

