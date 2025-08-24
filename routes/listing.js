const express =require("express");
const router=express.Router();
const listingController =require('../controller/listing.js');
const {isLoggedin,isOwner,listingValidation}=require("../middleware.js");
const multer=require("multer");
const Listing = require("../model/listings.js");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});
function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}


router.get("/", asyncWrap(listingController.index));


router.get("/new",
  isLoggedin, 
  (req,res)=>{
  res.render("./listings/new.ejs");
});

router.get("/:id/edit",
  isLoggedin,
  isOwner,
  asyncWrap(listingController.editListing));

router.route("/:id")
.put(
  isLoggedin,
  isOwner,
  upload.single("listing[image]"),
  listingValidation,
  asyncWrap(listingController.updateListing))
  .delete(isLoggedin,
  isOwner,
  asyncWrap(listingController.deleteListing))
  .get( asyncWrap(listingController.showListing));

router.post("/add",
  upload.single("listing[image]"),
  listingValidation,
  isLoggedin,
   asyncWrap(listingController.createListing));

// router.post("/add", upload.single("listing[image]"),(req,res)=>res.send(req.file));

  module.exports=router;