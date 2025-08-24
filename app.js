if(process.env.NODE_ENV!="production")
require('dotenv').config();


const express= require("express");
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");
app = express();
const ejsMate= require("ejs-mate");
const path =require("path");
const mongoose=require("mongoose");//requiring mongoose for db
// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dbURL=process.env.ATLAS_DB;
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStratergy=require("passport-local");
const User=require("./model/user.js");
const Listing = require("./model/listings.js");

const methodOverride=require("method-override");
const user = require("./model/user.js");
app.engine('ejs',ejsMate);

// used to set up and configure express to use a templating engine ejs for rendering dynamci web pages
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(methodOverride('_method'));//connection of mongoose 

const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRETKEY
  },
  touchAfter:24*3600
});

store.on("error",()=>{
  console.log("Error on mongo session store");
})

app.use(session({
  store,
  secret:process.env.SECRETKEY,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}
));
app.use(flash());

app.use(passport.initialize());  
app.use(passport.session());

passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
async function main() {
  await mongoose.connect(dbURL);
}


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


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

function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}

//adding review
// app.post("/listing/:id/addReview",async(req,res)=>{
//       let listing=await Listing.findById(req.params.id);
//       let review=req.body;
//       let newReview=new Review({
//         comment:review.comment,
//         rating:review.rating
//       });
//       listing.review.push(newReview);
//       await newReview.save();
//       await listing.save();
//       res.render("saved");
// })

app.use("/",userRoute);
app.use("/listing",listingRoute);
app.use("/listing/review",reviewRoute);

app.get("/",asyncWrap(async (req,res)=>{
  const newData = await Listing.find({});
  res.render("./listings/listing.ejs",{newData});
}));

app.get("/demoUser",asyncWrap(async(req,res)=>{
  let fakeUser=new User({
    email:"agarwalsruthi@gmail.com",
    username:"Shruthi"
  });
  let registerUser=await User.register(fakeUser,"hello@124");
  res.send(registerUser);
}))

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
  let {status=500,message="Some Error has Occured"}=err;
  // res.status(status).send(message);
  res.render("./listings/error.ejs",{err});
})

app.listen(2901, () => {
  console.log("Server is listening on port 2901");
});
