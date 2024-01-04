const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpreeError = require("../utils/ExpressError.js");
const { isLogedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  // Index Listing Route
  .get(wrapAsync(listingController.index))
  //Create Listing Route
  .post(
    isLogedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Listing Route

router.get("/new", isLogedIn, listingController.renderNewForm);
router
  .route("/:id")
  // Show Listing Route
  .get(wrapAsync(listingController.showListing))
  // Update Listing Route
  .put(
    isLogedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //Delete Listing Route
  .delete(isLogedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Listing Route

router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
router.get("/filters/:filter",wrapAsync( listingController.filters))
module.exports = router;
