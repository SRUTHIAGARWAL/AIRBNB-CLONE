const express= require("express");
app = express();
const ejsMate= require("ejs-mate");
const path =require("path");
const mongoose=require("mongoose");//requiring mongoose for db
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("./model/listings.js");
const methodOverride=require("method-override");
app.engine('ejs',ejsMate);

// used to set up and configure express to use a templating engine ejs for rendering dynamci web pages
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(methodOverride('_method'));//connection of mongoose 
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("Connection is successful"))
  .catch(err => console.log(err));

// app.get("/testListing",async (req,res)=>
// {
//   let sampleListing = new Listing({
//     title : "Masineni Grand",
//     description :"It is a 3 star hotel and comfortable place to stay at",
//     image : "https://lh3.googleusercontent.com/p/AF1QipMEbrG2AkuqxvIjti4T6eRzhCvchbr0YKy14xXF=s680-w680-h510",
//     price : 3000,
//     location : "Sapthagiri circle, Anantapur",
//     country : "India"
//   });
//   await sampleListing.save();
//   console.log("saved");
//   res.send("sucessfully saved");
// });


app.get("/listing",async (req,res)=>{
  const newData = await Listing.find({});
  res.render("./listings/listing.ejs",{newData});
});

app.get("/listing/:id/edit", async(req,res)=>{
  let {id}=req.params;
  let list= await Listing.findById(id);
  res.render("./listings/edit.ejs", {list});
});

app.put("/listing/:id",async (req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.Listing});
  res.redirect("/listing");
});

app.delete("/listing/:id",async (req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

app.get("/listing/new", (req,res)=>{
  res.render("./listings/new.ejs");
});

app.post("/listing/add", async(req,res)=>{
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
});

app.get("/listing/:id", async(req,res)=>{
  let {id}=req.params;
  let list= await Listing.findById(id);
  res.render("./listings/place.ejs", {list});
});



app.get("/", (req, res) => {
  res.send("Route is working");
});

app.listen(2901, () => {
  console.log("Server is listening on port 2901");
});
