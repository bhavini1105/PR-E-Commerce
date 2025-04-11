const SubCatModel = require('../models/subcatModel')
const fs = require('fs');


module.exports.subcategoryCreate = async(req,res)=>{
    try {
        console.log(req.file);

        await SubCatModel.create({...req.body, image :req.file.path});
        return res.status(201).json({message : "Data Added Sucessfully..."});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message:error.message});
    }
}

module.exports.subcategory = async(req,res)=>{
    try {
        let subCategories = await SubCatModel.find({}).populate('categoryId');
        return res.status(200).json(subCategories);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

module.exports.deletesubcat = async(req,res)=>{
    try {
        let { id } = req.params;
        let subCategory = await SubCatModel.findByIdAndDelete(id);
        fs.unlinkSync(subCategory.image);
        return res.status(200).json({message : "Data Deleted Successfully.."});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

module.exports.updatesubcat= async(req,res)=>{
    try {

       let subCategory =  await SubCatModel.findById(req.params.id);
       let image ="";

       if(req.file){
        image = req.file.path;
        fs.unlinkSync(subCategory.image);
       }
       else{
        image = subCategory.image;
       }

       subCategory.name = req.body.name;
       subCategory.image = image;

       await subCategory.save();
       return res.status(200).json({message:"Data Updated Succesfully.."});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

module.exports.login = (req,res)=>{
    return res.render('pages/login');
}
module.exports.signup = (req,res)=>{
    return res.render('pages/signup');
}