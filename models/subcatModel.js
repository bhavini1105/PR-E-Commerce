const { default: mongoose } = require("mongoose");

const subCatSchema = new mongoose.Schema({
    name : String,
    image : String,
    categoryId :{
        type :mongoose.Schema.Types.ObjectId ,
        ref : 'CatModel'
    }
},{timestamps : true});

const SubCatModel = new mongoose.model("SubCatModel",subCatSchema)

module.exports = SubCatModel;


