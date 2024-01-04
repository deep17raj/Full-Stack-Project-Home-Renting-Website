const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");


// SignUp route

router.route("/signup")
.get(userControllers.renderSignUpForm)
.post(wrapAsync(userControllers.signUp));




// Login route

router.route("/login")
.get(userControllers.renderLogInForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), wrapAsync(userControllers.logIn));


router.get("/logout",userControllers.logOut)


module.exports = router;