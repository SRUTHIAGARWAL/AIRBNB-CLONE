const express=require("express");
const router=express.Router();
const ExpressError=require("../util/ExpressError");
const User = require('../model/user.js');
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


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

router.post("/signup",asyncWrap(async(req,res)=>{
    try{
    let {email,username,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
    req.flash("success","Welcome to wanderlust");
    res.redirect("/listing");
    })
    }
    catch(e){
        req.flash("error","Registered user already exists");
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login",saveRedirectUrl,
    passport.authenticate(
        "local",
        {failureRedirect:"/login",
        failureFlash:true}),
        asyncWrap(async(req,res)=>{
          req.flash("success","welcome to homyhive!");
          let redirectUrl=res.locals.redirectUrl||"/listing";
          res.redirect(redirectUrl);
            }
        )
    )

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","You are logged out.");
        res.redirect("/listing");
    })
})

module.exports=router;