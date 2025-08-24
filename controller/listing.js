const Listing = require("../model/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index=async (req, res, next) => {
    const newData = await Listing.find({});
    res.render("./listings/listing.ejs", {newData} );
  }

module.exports.editListing =async(req,res)=>{
  let {id}=req.params;
  let list= await Listing.findById(id);
  let imageUrl=list.image.url;
  imageUrl=imageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("./listings/edit.ejs", {list,imageUrl});
}

module.exports.updateListing= async (req,res)=>{
 
    let {id}=req.params;
    if(!req.body.listing)
    { req.flash("error","Listing doesnot exist");
      res.redirect("/");
      // throw new ExpressError(400,"Listing not found");//error from client side when the corresponding listing for which search is being made is not present.
    }
   let updatedList=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   let url=req.file.path;
  let filename=req.file.filename;
  updatedList.image={url,filename};
  await updatedList.save();
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
  let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
  let url=req.file.path;
  let filename=req.file.filename;
    const newPlace=new Listing(req.body.listing);
    newPlace.owner=req.user._id;
    newPlace.image={url,filename};
    newPlace.geometry=response.body.features[0].geometry;

    let listingDetails=await newPlace.save();
    console.log(listingDetails);
    req.flash("success","new listing created");
    res.redirect("/");
 }