const express = require("express");
const router = express.Router({mergeParams: true}); //Basically this does what that when we are checking for parent route(which we used in app.js(main file) for identifying review related cases then the :id parameter is not passed to this review.js file it just got cheked but not reaches this file, that's why we use mergeParams it sends the :id to this file as well in the route)
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");






//Post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;