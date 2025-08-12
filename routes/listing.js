const express =require("express");
const router=express.Router();
const ExpressError=require("../util/ExpressError.js");
const {listingSchema} = require('../schema.js');
const Listing = require("../model/listings.js");

function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}

const listingValidation=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    { let {errmsg}=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else
      next();
}

router.get("/",asyncWrap(async (req,res)=>{
  const newData = await Listing.find({});
  res.render("./listings/listing.ejs",{newData});
}));

router.get("/:id/edit",asyncWrap( async(req,res)=>{
  let {id}=req.params;
  let list= await Listing.findById(id);
  res.render("./listings/edit.ejs", {list});
}));

router.put("/:id",listingValidation,asyncWrap(async (req,res)=>{
  
  let {id}=req.params;
  if(!req.body.Listing)
  {
    throw new ExpressError(400,"Listing not found");//error from client side when the corresponding listing for which search is being made is not present.
  }
  await Listing.findByIdAndUpdate(id,{...req.body.Listing});
  res.redirect("/listing");
}));

router.delete("/:id",asyncWrap(async (req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
}));

router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate("review");

    if (!list) {
        // If no listing is found, throw a 404 error
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/place.ejs", { list });
}));

router.get("/new", (req,res)=>{
  res.render("./listings/new.ejs");
});

router.post("/add",listingValidation, asyncWrap(async(req,res)=>{
  let newList= req.body;
  newPlace=new Listing({
    title : newList.title,
    description : newList.description,
    image : newList.image,
    price : newList.price,
    location : newList.location,
    country : newList.country
  });
   await newPlace.save();
   res.redirect("/listing");
}));


  module.exports=router;