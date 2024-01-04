const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpreeError = require("../utils/ExpressError.js");
const {validateReview, isLogedIn, isRevieAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");


 // Create Review Route


 router.post("/",isLogedIn,validateReview,wrapAsync(reviewController.createReviews));


// Delete Review Route


router.delete("/:reviewId",isLogedIn,isRevieAuthor,wrapAsync(reviewController.destryReviews));

module.exports = router;