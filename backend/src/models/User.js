import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
})

UserSchema.plugin(passportLocalMongoose.default);

export default mongoose.model("User", UserSchema)