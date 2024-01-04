if(process.env.NODE_ENV != "production"){
  require("dotenv").config();  
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpreeError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const { number } = require("joi");
const listingsRoute = require("./routes/listingroute.js");
const reviewsRoute = require("./routes/reviewroute.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoute = require("./routes/userroute.js");

const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connection successful")
})
.catch((err)=>{
    console.log(err)
})


async function main(){
    await mongoose.connect(dbUrl);
}

app.set("views",path.join(__dirname,"views"));
app.set("view wngine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

// Mongo session store
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
}
    
);

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err)
})
// Express Session
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

// Home Route


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// app.get("/demoUser", async (req,res)=>{
//     let fakeUser = new User({
//         email:"lucifer69@gmail.com",
//         username:"lucifer69"
//     })
//     let registeredUser = await User.register(fakeUser,"lucifer69");
//     res.send(registeredUser)
// })

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/",userRoute)





 // Error Middlewares

 app.all("*",(req,res,next)=>{
    next(new ExpreeError(404,"page not found"))
 })


 app.use((err,req,res,next)=>{
    let {statuscode=500,message="some error occured"} = err;
    res.status(statuscode).render("listing/error.ejs",{err})
    // res.status(statuscode).send(message);
 })

app.listen(8080,()=>{
    console.log("Server is listening at port 8080")
});
