import mongoose, {Schema} from "mongoose";


const CartSchema= new mongoose.Schema({
    name:{
        type: String,
    },
    price:{
        type:Number,
        required: true,
    },
    quantity: Number,
    image:String,
    itemId: String,
    author:{
        type:Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model("CartItem",CartSchema)