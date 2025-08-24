const express=require("express");
const router=express.Router();
const {reviewValidation,isLoggedin,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controller/review.js");

function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}


router.post(
  "/:id/addReview",isLoggedin,reviewValidation,asyncWrap(reviewController.addReview));

  //deletereview
  router.delete("/:id/:reviewid",isLoggedin,isReviewAuthor,asyncWrap(reviewController.deleteReview));

  module.exports=router;