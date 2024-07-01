const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schemaValidation.js")
const { isLoggedIn } = require("../middleware.js");


// Validation-middleware (Joi)  
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



// NEW route (GET -> POST)
router.get("/new",
    isLoggedIn,                                    // firstly , user should be for authorization 
    (req, res) => {
        res.render("listings/new.ejs");
    });

router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {

        const data = req.body.listing;            // req.body k "listing" object ki details extract krega

        const newListing = new Listing(data);

        await newListing.save();

        req.flash("success", "Added New Listing");

        res.redirect("/listings");
    }));



// EDIT route (GET -> PUT)
router.get("/:id/edit",
    isLoggedIn, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}));


router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });  // req.body.listing is an object . It is reconstructed/spreaded to obtain indivisual {key:value} pairs

        req.flash("success", "Listing Updated");

        res.redirect(`/listings/${id}`);
    }));




// SHOW route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");   // reviews ka actual data bhi show hoga

    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));



// DELETE route
router.delete("/:id",
    isLoggedIn, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);                             // "findByIdAndDelete" is triggering mongoose-post middleware

    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}));


module.exports = router;