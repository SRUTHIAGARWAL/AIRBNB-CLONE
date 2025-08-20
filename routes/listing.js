const express =require("express");
const router=express.Router();
const listingController =require('../controller/listing.js');
const {isLoggedin,isOwner,listingValidation}=require("../middleware.js");
function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}


router.get("/", asyncWrap(listingController.index));

router.get("/:id/edit",
  isLoggedin,
  isOwner,
  asyncWrap(listingController.editListing));

router.put("/:id",
  listingValidation,
  isLoggedin,
  isOwner,
  asyncWrap(listingController.updateListing));

router.delete("/:id",
  isLoggedin,
  isOwner,
  asyncWrap(listingController.deleteListing));

router.get("/new",
  isLoggedin, 
  (req,res)=>{
  res.render("./listings/new.ejs");
});

router.get("/:id", asyncWrap(listingController.showListing));

router.post("/add",listingValidation,isLoggedin, asyncWrap(listingController.createListing));


  module.exports=router;