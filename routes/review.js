const express = require("express");
const router = express.Router({mergeParams : true});                                 // parent route ("/listings/:id/reviews") k 'id' parameter ko review.js m use krne k liy , {mergeParams: true}


const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// CREATE route ( "/" ---> "/listings/:id/reviews" )
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));     


// DELETE route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));   

module.exports = router;
