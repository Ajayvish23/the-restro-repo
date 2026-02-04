import MenuItem from "./models/MenuItem.js";
import cors from "cors"
import mongoose from "mongoose";
import express from "express";
const app = express();

import session from "express-session";
import passport from "passport";
import User from "./models/User.js";
import wrapAsync from "./utils/wrapAsync.js";
import Cart from "./models/Cart.js";
import isLoggedIn from "./middleware/isLoggedIn.js";

app.use(cors({
    origin: "http://localhost:5173", // EXACT frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
})); // allow frontend to access backend
app.use(express.json());

async function connectToDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017/therestro')
}
connectToDB()
    .then(()=>{console.log("connected to DB...")})
    .catch((err)=>{console.log(err)})



app.use(
    session({
        secret:"session-secret",
        resave:false,
        saveUninitialized:false
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.get("/", (req,res)=>{
    res.send("I am home")
})

app.get("/api/menu", wrapAsync(async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
}));


//Signup route
app.post("/api/register", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        await User.register({username,email},password);
    }catch (err){
        console.log(err.name);
        if(err.name==="UserExistsError"){
            res.status(400).json({message:"User already exist"})
        }
        next(err);     // hands the error to Express’s global error handler.
    }

    res.status(201).json({ message: "User registered successfully" });
    console.log(username,email,password);
}));


//Login route
app.post("/api/login",passport.authenticate("local"),(req,res)=>{
    res.json({message:"Login successful", user: req.user});    //req.user is the authenticated user object that Passport attaches to the req after successful login. And here we are sending this user details to the client.
})


//Logout route
app.post("/api/logout",(req,res)=>{
    req.logout(()=>{             // removes req.user
        req.session.destroy(() => {      // deletes the session from the store
            res.clearCookie("connect.sid"); // removes session cookie from browser
            res.json({ message: "Logout successful" });
        });
    })
})


//Send user details on page load/refresh
app.get("/api/getuser",(req,res)=>{
    if (!req.user) {
        return res.json({ user: null });
    }
    res.json({user: req.user})
})


//add cart route
app.post("/api/cart", isLoggedIn,async(req,res)=>{
    try{
        let {itemId,name,price,quantity,image}= req.body;
        let author=req.user._id
        //console.log(cartItem)
        console.log(author)
        const existingItem=await Cart.findOne({author,itemId});
        if(existingItem){
            existingItem.quantity+=1;
            await existingItem.save();
        }
        else{
            let cartItem=await new Cart({itemId, name, price, quantity,image,author});
        await cartItem.save();
        }
    }catch(err){
        console.log(err);
    }

})

app.get("/api/cart", async(req,res)=>{
    try{
        let cartData= await Cart.find();
        res.json(cartData);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching data"})
    }
});

//delete item from cart route
app.post("/api/cart/delete", async(req, res)=>{
    try{
        let {id}= req.body;
        console.log(id);
        let cartItem= await Cart.findByIdAndDelete(id);
        console.log(cartItem);
    }catch(err){
        console.log(err);
    }
})

//update item from cart route
app.post("/api/cart/update", async(req, res)=>{
    try{
        let {id,inc}= req.body;
        console.log(id,inc);
        if(inc){
            let cartItem= await Cart.findByIdAndUpdate(id, { $inc: { quantity: 1 } },{ new: true });
            console.log(cartItem);
        }
        else{
            let cartItem= await Cart.findByIdAndUpdate(id, { $inc: { quantity: -1 } },{ new: true });
            console.log(cartItem);
        }
    }catch(err){
        console.log(err);
    }
})







//global error handler middleware
app.use((err,req,res,next)=>{
    res.status(500).json({message:"Internal server error"});
    console.error(err);
});


export default app;