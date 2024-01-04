const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  if (typeof req.body.price === NaN) {
    throw new ExpreeError(400, "Price should be a Number");
  }
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()
  let url = req.file.path;
  let fileName = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,fileName};
  newListing.geometry = response.body.features[0].geometry
  let savedListing = await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { list });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl = list.image.url;
  originalImageUrl =originalImageUrl.replace("/upload","/upload/h_300,w_250")
  res.render("listing/edit.ejs", { list, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if ((req.body.price = NaN)) {
    throw new ExpreeError(400, "Price should be a Number");
  }
  let { id } = req.params;
  
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true }
  );
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()
    listing.geometry = response.body.features[0].geometry
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
  let fileName = req.file.filename;
  listing.image = {url,fileName};
  }
  await listing.save();
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.filters = async(req,res)=>{
  let {filter} = req.params;
let allListing =   await Listing.find({category:filter});
res.render("listing/filter.ejs",{allListing})
};