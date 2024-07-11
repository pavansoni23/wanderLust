const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schemaValidation.js");


// Validation-middleware (Joi)  
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {                                          // if user is not logged-in
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }

    next();
};


module.exports.isOwner = async (req, res, next) => {

    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}



module.exports.isReviewAuthor = async (req, res, next) => {

    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!res.locals.currUser._id.equals(review.author._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}