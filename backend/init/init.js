//this file is used only once to insert demo data in mongoDB.
import mongoose from "mongoose";
import MenuItem from "../src/models/MenuItem.js";
import menuData from "./menuData.js"


main()
    .then(()=>{console.log("connected to DB...")})
    .catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/therestro')
}

const initDB = async ()=>{
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuData);
    console.log("done");
    mongoose.connection.close();
}

initDB();










