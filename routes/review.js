const express = require("express");
const router = express.Router({mergeParams : true});    
 // parent route ("/listings/:id/reviews") k 'id' parameter ko review.js m use krne k liy , {mergeParams: true}


const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schemaValidation.js");


// Validation-middleware (Joi) 
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};





// CREATE route
router.post("/",                                     // / -> "/listings/:id/reviews"
    validateReview,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        let listing = await Listing.findById(id);

        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success" , "New Review Created");

        res.redirect(`/listings/${id}`);
    })
);



// DELETE route
router.delete("/:reviewId" , wrapAsync(async(req , res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});    // reviews array m s reviewId wale document ko dlt/pull krdo
    await Review.findByIdAndDelete(reviewId);     
    
    req.flash("success" , "Review Deleted");

    res.redirect(`/listings/${id}`);
}));   

module.exports = router;