const { populate } = require('dotenv');
const ExtraCatModel = require('../models/extraCatModel');
const fs = require('fs');



module.exports.extracategoryCreate = async(req,res)=>{
    try {
        console.log(req.file);

        await ExtraCatModel.create({...req.body, image :req.file.path});
        return res.status(201).json({message : "Data Added Sucessfully..."});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message:error.message});
    }
}

module.exports.extracategory = async(req,res)=>{
    try {
        let categories = await ExtraCatModel.find({}).populate({path : "subcatId", populate:{path:"categoryId"}});
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

module.exports.deleteextracat = async(req,res)=>{
    try {
        let { id } = req.params;
        let category = await ExtraCatModel.findByIdAndDelete(id);
        fs.unlinkSync(category.image);
        return res.status(200).json({message : "Data Deleted Successfully.."});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

module.exports.updateextracat= async(req,res)=>{
    try {

       let category =  await ExtraCatModel.findById(req.params.id);
       let image ="";

       if(req.file){
        image = req.file.path;
        fs.unlinkSync(category.image);
       }
       else{
        image = category.image;
       }

       category.name = req.body.name;
       category.image = image;

       await category.save();
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