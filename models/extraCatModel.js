const { default: mongoose } = require("mongoose");
const { category } = require("../controllers/categoryController");

const extracatSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String,
    price : String,
    categoryId :{
        type :mongoose.Schema.Types.ObjectId ,
        ref : 'CatModel'
    },
    subcatId : {
        type :mongoose.Schema.Types.ObjectId ,
        ref : 'SubCatModel'
    }
},{timestamps : true});

const ExtraCatModel = new mongoose.model("ExtraCatModel",extracatSchema)

module.exports = ExtraCatModel;


