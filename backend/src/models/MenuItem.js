import mongoose from "mongoose";

const MenuSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    price:{
            type:Number,
            required: true,
    },
    category:String,
    image:String,
    rating: Number,
    reviews: Number,
    description:String,

})


export default mongoose.model("MenuItem", MenuSchema);