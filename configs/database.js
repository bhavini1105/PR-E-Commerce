const { default: mongoose } = require("mongoose");

require('dotenv').config();

const db = async()=>{
    try {
        mongoose.connect(process.env.DB_URL);
        console.log("Database Connected....");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = db;