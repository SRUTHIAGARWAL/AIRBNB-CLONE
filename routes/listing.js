const express =require("express");
const router=express.Router();
const ExpressError=require("../util/ExpressError");
const {listingSchema} = require('../schema.js');
const Listing = require("../model/listings.js");
const {isLoggedin,isOwner,listingValidation}=require("../middleware.js");
function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}



router.get("/",asyncWrap(async (req,res)=>{
  const newData = await Listing.find({});
  res.render("./listings/listing.ejs",{newData});
}));

router.get("/:id/edit",isLoggedin,isOwner,asyncWrap( async(req,res)=>{
  let {id}=req.params;
  let list= await Listing.findById(id);
  res.render("./listings/edit.ejs", {list});
}));

router.put("/:id",listingValidation,isLoggedin,isOwner,asyncWrap(async (req,res)=>{
  
  let {id}=req.params;
  if(!req.body.listing)
  { req.flash("error","Listing doesnot exist");
    res.redirect("/");
    // throw new ExpressError(400,"Listing not found");//error from client side when the corresponding listing for which search is being made is not present.
  }
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Updated");
  res.redirect("/listing");
}));

router.delete("/:id",isLoggedin,isOwner,asyncWrap(async (req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
  res.redirect("/listing");
}));


router.get("/new",isLoggedin, (req,res)=>{
  res.render("./listings/new.ejs");
});


router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate("review").populate("owner");

    if (!list) {
        // If no listing is found, throw a 404 error
        req.flash("error","Listing doesnot exist");
        res.redirect("/");
    }
    res.render("listings/place.ejs", { list });
}));

router.post("/add",listingValidation,isLoggedin, asyncWrap(async(req,res)=>{
   const newPlace=new Listing(req.body.listing);
   newPlace.owner=req.user._id;
   await newPlace.save();
   req.flash("success","new listing created");
   res.redirect("/");
}));


  module.exports=router;