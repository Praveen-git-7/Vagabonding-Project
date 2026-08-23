const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


//Is the action taker logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //Storing route for the path where user wanted to go before login to direct him to that route after login
        req.session.redirectUrl = req.originalUrl;
        // console.log("-----------------------------===");
        // console.log(req.session.redirectUrl);
        req.flash("error", "You must be logged in to Create a listing!");
        return res.redirect("/login");
    }
    next();
};


//For saving the url which the user clicked before logging or signing himself in
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


//For owner of a listing
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have the right, O! you don't have the right");
        return res.redirect(`/listings/${id}`);
    }

    next();
};




//Validates data for newly created listings
module.exports.validateListing = (req, res, next) => {
    //Joi validation
    let {error} = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};




//Validates data for us from client
module.exports.validateReview = (req, res, next) => {
    //Joi validation
    let {error} = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//For review's authors
module.exports.isReviewAuthor = async (req, res, next) => {
    console.log(`---------`);
    console.log(req.params);
    let {id, reviewId} = req.params;
    console.log(`${id} ----------------- ${reviewId}`);
    let review = await Review.findById(reviewId);
    console.log(review);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Write your own review to delete");
        return res.redirect(`/listings/${id}`);
    }

    next();
};