const { default: mongoose } = require("mongoose");

const adminSchema= new mongoose.Schema({
    username : String,
    password : String
},{timestamps : true});

const adminModel = mongoose.model("adminModel",adminSchema);

module.exports = adminModel;