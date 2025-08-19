const express=require("express");
const router=express.Router();
const Review=require("../model/review.js");
const {reviewValidation}=require("../middleware.js")
const Listing = require("../model/listings.js");

function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}


router.post(
  "/:id/addReview",reviewValidation,asyncWrap(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let { comment, rating } = req.body;
    let newReview = new Review({ comment, rating });
    await newReview.save();
    listing.review.push(newReview); // corrected field name
    await listing.save();
    req.flash("success","new review created");
    res.redirect(`/listing/${listing._id}`); // redirect after post
  }));

  //deletereview
  router.delete("/:id/:reviewid",asyncWrap(async(req,res)=>{
      let {id,reviewid}=req.params;
      await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
      await Review.findByIdAndDelete(reviewid);
      req.flash("success","review deleted");
      res.redirect(`/listing/${id}`)
  }))

  module.exports=router;