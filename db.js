const mongoose = require('mongoose');
//const dotenv = require('dotenv').config();
require("dotenv").config();

const MONGO_URL = process.env.URL;


//const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primaryPreferred"
//const mongoURI = 'MONGO_URL'

//'mongodb+srv://vivek:vivek123@cluster0.hzfq07l.mongodb.net/notebook';
const connectToMongo = () => {
    mongoose.connect(MONGO_URL, () => {
        console.log("Connected to Mongo Successfully");
        
    })
}

module.exports = connectToMongo;




//mongodb://localhost:27017/?readPreference=primaryPreferred
//mongodb://localhost:27017/?readPreference=primaryPreferred
//mongodb://localhost:27017/
//mongodb://localhost:27017/

//const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primaryPreferred"
//mongodb://localhost:27017/

//mongodb://localhost:27017/
