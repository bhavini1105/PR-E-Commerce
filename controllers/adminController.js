const fs = require('fs');
const upload = require("../middlewares/uploadImge");
const adminModel = require("../models/adminModel");
const nodemailer = require('nodemailer');
const CatModel = require('../models/categoryModel');
const ExtraCatModel = require('../models/extraCatModel');
const SubCatModel = require('../models/subcatModel');

require('dotenv').config();

let gmailpass = process.env.GMAIL_PASS;


module.exports.adminPage = (req, res) => {
    return res.render('index');
}

module.exports.loginPage = (req,res)=>{
    return res.render('pages/login');
}

module.exports.signupPage = (req,res)=>{
    return res.render('pages/signup');
}

module.exports.signup = async (req, res) => {
    try {
        let { username, password, email, confirmpassword } = req.body;

        console.log(req.body);

        if (password === confirmpassword) {
            let user = await adminModel.create({ username, password, email });
            console.log('user created');
            return res.redirect('/login');
        }


        return res.redirect('/signup');

    } catch (error) {
        return res.redirect('/signup');
    }
}

let otp;
module.exports.forgotpassword = async (req, res) => {
    try {

        let user = await adminModel.findOne({ email: req.body.email });
        
        if (user) {
            console.log("hello");

            otp = Math.floor(100000 + (Math.random() * 900000));

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "bhavinipatel7532@gmail.com",
                  pass: gmailpass,
                },
              });

              const info = await transporter.sendMail({
                from: '"Maddison Foo Koch 👻" <bhavinipatel7532@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "Hello ✔ OTP Verify", // Subject line
                html: `<stromg> OTP : ${otp}</strong>`, // html body
              });

              console.log("done");
              
              res.cookie("email",JSON.stringify(req.body.email));

              return res.redirect('/verifyotp');


        }
        else{
            
            return res.redirect('/email');
            // return res.json({message : "User not found"});
        }

    } catch (error) {
        return res.json({message : error.message});
    }

}

module.exports.verifyotpPage = (req,res)=>{
    try {
        const {otp} = req.body;

        if(otp == otp){
            return res.redirect('/setPassword');
        //    return res.json({message : "OTP Verified Succesfully.."});
        }
        else{
            return res.redirect('/verifyotp');
            // return res.json ({message : "Invalid OTP"});
        }

    } catch (error) {
        return res.json({message : error.message});
    }
}

module.exports.forgotpasswordPage = (req, res) => {
    return res.render('pages/email');
}

module.exports.verifyotp = (req, res) => {
    return res.render('pages/verifyotp');
}

module.exports.setPassword = (req, res) => {
    return res.render('pages/setPassword');
}

module.exports.setPasswordPage =async(req,res)=>{
    try {

        let email = JSON.parse(req.cookies.email);
        let user = await adminModel.findOne({email : email});

        let{new_password , confirm_password} = req.body

        if(new_password === confirm_password){
            user.password = new_password;

            await user.save();
            // return res.json({message : "Password Changed Sucessfully.."});
            return res.redirect('/login');
        }
        else{
            return res.redirect('pages/setPassword');
            // return res.json({message : "Password not matched"});
        }
        

    } catch (error) {
        return res.json({message : error.message});
    }
}

module.exports.viewData = async (req, res) => {
    try {
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({}).populate("categoryId", "name");
        let extraData = await ExtraCatModel.find({}).populate("subcatId","name");
        return res.render('pages/viewdata', { catData, subData ,extraData });
    } catch (error) {
        console.log(error.message);
        return res.render('pages/viewdata', { catData: [] ,subData : [],extraData:[] });
    }
}

module.exports.formData = async (req, res) => {
    try {
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({}).populate("categoryId", "name");
        let extraData = await ExtraCatModel.find({}).populate("subcatId","name");
        return res.render('pages/form', { catData , subData , extraData });
    } catch (error) {
        console.log(error.message);
        return res.render('pages/form', { catData: [] , subData :[] , extraData :[] });
    }
}

module.exports.delete = async (req, res) => {
    try {
        let { id } = req.params;

         // Delete the category
         let deletData = await CatModel.findByIdAndDelete(id);

         // Step 1: Get all subcategories of this category
         let subcategories = await SubCatModel.find({ categoryId: id });
 
         // Step 2: Get all subcategory IDs
         let subcatIds = subcategories.map(sub => sub._id);
 
         // Step 3: Delete all extra categories related to those subcategories
         await ExtraCatModel.deleteMany({ subcatId: { $in: subcatIds } });
 
         // Step 4: Delete all subcategories
         await SubCatModel.deleteMany({ categoryId: id });
 
         // Step 5: Delete image file
         if (deletData?.image && fs.existsSync(deletData.image)) {
             fs.unlinkSync(deletData.image);
         }

        return res.redirect('/viewdata')
    } catch (error) {
        console.log(error.message);
        return res.redirect('/viewdata');
    }
}

module.exports.deletesub = async (req, res) => {
    try {
        let { id } = req.params;
        await SubCatModel.findByIdAndDelete(id);
        return res.redirect('/viewdata');
    } catch (error) {
        console.log(error.message);
        return res.redirect('/viewdata');
    }
}

module.exports.categoryPage = (req, res) => {
    return res.render('pages/form');
}

module.exports.category = async (req, res) => {
    try {
        await CatModel.create({ ...req.body, image: req.file.path });
        return res.redirect('/form');
    } catch (error) {
        console.log(error);
        return res.redirect('/form');
    }
}

module.exports.subcategoryPage = async (req, res) => {
    let subData = await SubCatModel.find({});
    return res.render('pages/form');
}

module.exports.subcategory = async (req, res) => {
    try {
        console.log(req.body);
        const { name, categoryId } = req.body;

        // Simple check if category is selected
        if (!categoryId) {
            return res.send("Please select a category before adding a sub-category.");
        }

        // Create new sub-category and link it
        const newSubCat = new SubCatModel({
            name,
            categoryId,
        });

        await newSubCat.save();
        // console.log("Sub category created...!");
        
        return res.redirect('/form');
    }
    catch (error) {
        console.log("Error creating sub-category:", error.message);
        return res.redirect('/form');
    }
}

module.exports.extracategoryPage = (req, res) => {
    return res.render('pages/form');
}

module.exports.extracategory = async (req, res) => {
    try {
        console.log(req.body);
        const { name, subcatId , description ,price } = req.body;

        // Simple check if category is selected
        if (!subcatId) {
            return res.send("Please select a category before adding a sub-category.");
        }

        const image = req.file ? req.file.path : null;
        // Create new sub-category and link it
        const newExtraCat = new ExtraCatModel({
            name,
            subcatId,
            image,
            description,
            price,
        });

        await newExtraCat.save();
        console.log("Sub category created...!");
        return res.redirect('/form');
    }
    catch (error) {
        console.log("Error creating sub-category:", error.message);
        return res.redirect('/form');
    }
}

module.exports.deleteextra = async (req, res) => {
    try {
        let { id } = req.params;
        let category = await ExtraCatModel.findByIdAndDelete(id);
        fs.unlinkSync(category.image);
        return res.redirect('/viewdata');
    } catch (error) {
        console.log(error.message);
        return res.redirect('/viewdata');
    }
}

module.exports.subcatPage = async (req, res) => {
    try {
        let { id } = req.params; 
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({});
        
        
        let extraData = await ExtraCatModel.find({ subcatId: id });

        return res.render('pages/subcat', { catData, subData, extraData });
    } catch (error) {
        console.log(error.message);
        return res.render('pages/subcat', { catData: [], subData: [], extraData: [] });
    }
}
