const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schemaValidation.js")


// Validation
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};




// INDEX route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();

    res.render("listings/allListings.ejs", { allListings });
}));



// NEW route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {

        const data = req.body.listing;            // req.body k "listing" object ki details extract krega

        const newListing = new Listing(data);

        await newListing.save();

        res.redirect("/listings");
    }));



// EDIT route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });
}));



// UPDATE route
router.put("/:id",
    validateListing,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });  // req.body.listing is an object . It is reconstructed to obtain indivisual {key:value} pairs

        res.redirect(`/listings/${id}`);
    }));



// SHOW route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");

    res.render("listings/show.ejs", { listing });
}));



// DELETE route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}));


module.exports = router;