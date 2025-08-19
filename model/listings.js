const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review=require("./review.js");
const User=require("./user.js");
const listingSchema = new mongoose.Schema({
  title : {
    type : String,
    uppercase : true,
    required : true
   },
   description :{
    type : String,
    trim : true,
    minLength : 50
   },
    image: {
      type: String,
      default: "https://unsplash.com/photos/a-castle-sitting-on-top-of-a-cliff-next-to-the-ocean-2IANV4if3u8"
    },
   price :
   {
     type : Number,
     min : 0,
     required: true
   },
   location :{
    type : String,
    required: true,
    },
    country:{
        type:String,
        required : true
    },
    review:[
      {
         type: Schema.Types.ObjectId,
         ref:"Review"
      }
    ],
      owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  } 
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing)
  {
    await Review.deleteMany({_id:{$in: listing.review}});
  }
})

const Listing= new mongoose.model("Listing",listingSchema);

module.exports=Listing;