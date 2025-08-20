const Review=require("../model/review.js");
const Listing = require("../model/listings.js");
module.exports.addReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let { comment, rating } = req.body;
    let newReview = new Review({ comment, rating });
    newReview.author=req.user._id;
    await newReview.save();
    listing.review.push(newReview); // corrected field name
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listing/${listing._id}`); // redirect after post
  }

  module.exports.deleteReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted");
    res.redirect(`/listing/${id}`)
}