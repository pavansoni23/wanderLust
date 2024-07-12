// INDEX route 
// NEW route (GET -> POST)
// SHOW route 
// EDIT route (GET -> PUT)
// DELETE route

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });                 // multer files ko cloudinary ki storage m store krayga



router.route("/")
    .get(wrapAsync(listingController.index))                                                                                 // INDEX route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.newListing));            // NEW (POST)                                  // NEW route (POST)



// NEW route (GET)
router.get("/new", isLoggedIn, listingController.newForm);                                                  // isLoggedIn -> user should be logged-in for authorization 



router.route("/:id")
    .get(wrapAsync(listingController.showListing))                                                                           // SHOW route
    .put(isLoggedIn, upload.single("listing[image]"), isOwner, validateListing, wrapAsync(listingController.editPut))        // EDIT (PUT)                        // EDIT route (PUT)                           
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));                                                // DELETE route



router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));


module.exports = router;