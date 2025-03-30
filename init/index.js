const mongoose=require("mongoose");//requiring mongoose for db
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("../model/listings.js");
const initData=require("./data.js");

//connection of mongoose 
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("Connection is successful"))
  .catch(err => console.log(err));

const initDB = async () =>{
   await Listing.insertMany(initData.data);
    console.log("data saved");
}          

initDB();