const express= require("express");
app = express();
const path =require("path");
const mongoose=require("mongoose");//requiring mongoose for db
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("./model/listings.js");

// used to set up and configure express to use a templating engine ejs for rendering dynamci web pages
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); // Parses form data
//connection of mongoose 
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
  res.render("listing.ejs",{newData});
});

app.get("/listing/new", (req,res)=>{
  res.render("new.ejs");
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
  res.render("place.ejs", {list});
});



app.get("/", (req, res) => {
  res.send("Route is working");
});

app.listen(2901, () => {
  console.log("Server is listening on port 2901");
});
