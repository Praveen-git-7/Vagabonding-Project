const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  // Listing.find({}).then((res) => {
  //     console.log(res);
  // });

  const allListings = await Listing.find({});
  //this null category is added to prevent error for initial page for filters
  res.render("listings/index.ejs", { allListings , category: null});
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing)
  if (!listing) {
    req.flash("error", "Listing doesn't exists!");
    return res.redirect("/listings");
  }
  // console.log("oooooooooooooooooooooooooooooo");
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();


  // if (!req.body.listing) {
  //     throw new ExpressError(404, "Send valid data for listing");
  // }

  //This is long and uncomfortable
  // let {title,description,price,image,country,location} = req.body;
  //So, In ejs file for naming use listing as an object to minimize writing(check ejsfile)
  // let Listing = req.body.listing; //Minimize two lines for one
  // new Listing(Listing);

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  if (response.body.features.length === 0) {
    req.flash("error", "Location might be incorrect or untracable");
    return res.redirect("/listings/new");
  }

  newListing.geometry = response.body.features[0].geometry;
  console.log(newListing.geometry);
  

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing doesn't exists!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  let allAttractions = listing.attractions || []; //For all features

  res.render("listings/edit.ejs", { listing, originalImageUrl, allAttractions });
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //     throw new ExpressError(404, "Send valid data for listing");
  // }
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};


module.exports.applyFilter = async(req, res ,next) => {
  let {category} = req.params;

  let allListings = await Listing.find({attractions: category});

  if (allListings.length === 0) {
    req.flash("error", "No place with this highlight");
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings , category});
};


module.exports.searchByCountry = async(req,res,next) => {
  let {country} = req.query;

  let allListings = await Listing.find({country: { $regex: `^${country}$`, $options: "i" }});

  if (allListings.length === 0) {
    req.flash("error", "No place from this Country");
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", {allListings, category:null});
};