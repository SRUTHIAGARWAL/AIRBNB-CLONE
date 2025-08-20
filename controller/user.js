const User = require('../model/user.js');
module.exports.signUp=async(req,res)=>{
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
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to homyhive!");
    let redirectUrl=res.locals.redirectUrl||"/listing";
    res.redirect(redirectUrl);
      }

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","You are logged out.");
        res.redirect("/listing");
    })
}