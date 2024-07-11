const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();

    res.render("listings/allListings.ejs", { allListings });
}



module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
}



module.exports.newListing = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;         // jo user logged-in h , uski id listing k owner m store krdo
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "Added New Listing");

    res.redirect("/listings");
}




module.exports.editForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}




module.exports.editPut = async (req, res) => {

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };

        await listing.save();
    }


    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
}



module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");          // reviews , reviews k author , listng k owner ka "actual data" bhi extract hoga


    if (!listing) {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}



module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);                             // "findByIdAndDelete" is triggering mongoose-post middleware

    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
}