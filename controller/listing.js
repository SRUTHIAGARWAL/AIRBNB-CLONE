const Listing = require("../model/listings.js");


module.exports.index=async (req, res, next) => {
    const newData = await Listing.find({});
    res.render("./listings/listing.ejs", {newData} );
  }

module.exports.editListing =async(req,res)=>{
  let {id}=req.params;
  let list= await Listing.findById(id);
  res.render("./listings/edit.ejs", {list});
}

module.exports.updateListing= async (req,res)=>{
    let {id}=req.params;
    if(!req.body.listing)
    { req.flash("error","Listing doesnot exist");
      res.redirect("/");
      // throw new ExpressError(400,"Listing not found");//error from client side when the corresponding listing for which search is being made is not present.
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect("/listing");
  }

  module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
  }

  module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");

    if (!list) {
        // If no listing is found, throw a 404 error
        req.flash("error","Listing doesnot exist");
        res.redirect("/");
    }
    res.render("listings/place.ejs", { list });
}

module.exports.createListing=async(req,res)=>{
    const newPlace=new Listing(req.body.listing);
    newPlace.owner=req.user._id;
    await newPlace.save();
    req.flash("success","new listing created");
    res.redirect("/");
 }