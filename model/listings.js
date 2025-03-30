const mongoose=require("mongoose");
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
    }
});

const Listing= new mongoose.model("Listing",listingSchema);

module.exports=Listing;