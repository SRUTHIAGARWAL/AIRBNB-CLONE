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
    url: String,
      filename:String
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
  } ,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
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