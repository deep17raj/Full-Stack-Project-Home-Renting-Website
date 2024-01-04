const User = require("../models/user")

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
    req.flash("success",`Welcome to Wanderlust ${username}`);
    res.redirect("/listings")
    })
    
    } catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
    
};

module.exports.renderLogInForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.logIn = async(req,res)=>{
    let {username} = req.body;
    req.flash("success",`Welcome back to Wanderlust ${username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
};

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        };
        req.flash("success","You logged out sucessfully");
        res.redirect("/listings")
    })
};