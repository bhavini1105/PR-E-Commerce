const { default: mongoose } = require("mongoose");

const catSchema = new mongoose.Schema({
    name : String,
    image : String
},{timestamps : true});

const CatModel = new mongoose.model("CatModel",catSchema)

module.exports = CatModel;


