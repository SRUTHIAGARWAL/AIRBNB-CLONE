const Listing = require("./model/listings.js");
const Review=require("./model/review.js");
const ExpressError=require("./util/ExpressError");
const {listingSchema} = require('./schema.js');
const {reviewSchema} = require('./schema.js');

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated())
    {   
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","The user must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.listingValidation=(req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error)
    { let errmsg=error.details.map(el=>el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else
      next();
}

module.exports.reviewValidation=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    { 
      const msg = error.details.map(el => el.message).join(",");
      throw new ExpressError(400,msg);
    }
    else
      next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;

  let listing=await Listing.findById(id);
    
  if (!listing.owner) {
    req.flash("error", "This listing has no owner!");
    return res.redirect("/listing");
  }

  if(res.locals.currUser &&  !listing.owner._id.equals(res.locals.currUser._id))
  {
    req.flash("error","You are not the owner");
    return res.redirect(`/listing/${id}`)
  }
next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;

  // 1. Fetch review document
  const review = await Review.findById(reviewid);

  // 2. If review not found, redirect
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listing/${id}`);
  }

  // 3. Ensure user is logged in
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in to do that!");
    return res.redirect("/login");
  }

  // 4. Check ownership
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to delete this review.");
    return res.redirect(`/listing/${id}`);
  }

  // 5. If everything is fine, continue
  next();
};

