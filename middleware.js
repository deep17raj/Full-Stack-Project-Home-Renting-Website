const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpreeError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLogedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login ");
        return res.redirect("/login")
    }
        next();
    
    
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner =  async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to  access it");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpreeError(400,errMsg)
       }
       else{
        next();
       }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpreeError(400,errMsg)
       }
       else{
        next();
       }
}

module.exports.isRevieAuthor =  async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to  access it");
        return res.redirect(`/listings/${id}`)
    }
    next();
}