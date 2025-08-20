const express=require("express");
const router=express.Router();
// const ExpressError=require("../util/ExpressError");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controller/user.js");

function asyncWrap(fn)
{
   return function(req,res,next)
   {
    fn(req,res,next).catch((err)=> next(err));
   }
}

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup",asyncWrap(userController.signUp));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",saveRedirectUrl,
    passport.authenticate(
        "local",
        {failureRedirect:"/login",
        failureFlash:true}),
        asyncWrap(userController.login)
    )

router.get("/logout",userController.logout)

module.exports=router;