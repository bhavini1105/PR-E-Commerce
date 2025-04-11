const { log } = require("console");
const CatModel = require("../models/categoryModel");
const ExtraCatModel = require("../models/extraCatModel");
const SubCatModel = require("../models/subcatModel");
const fs = require('fs');

module.exports.homePage = async(req, res) => {
    try {
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({});
        let extraData = await ExtraCatModel.find({});

        return res.render('pages/homepage',{catData , subData , extraData});
    } catch (error) {
        console.log(error.message);
        return res.render('pages/homepage', { catData :[] , subData:[] , extraData :[]});
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
        const { name, subcatId , description } = req.body;

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

module.exports.viewSingleExtra = async (req, res) => {
    try {
        const { id } = req.params;
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({});
        let extraData = await ExtraCatModel.find({});

        const extra = await ExtraCatModel.findById(id).populate('subcatId');
        if (!extra) {
            return res.status(404).send("Extra Category not found");
        }

        return res.render('pages/singlepage', { catData , subData ,extraData, extra });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
};

module.exports.addToCart = (req, res) => {
    const productId = req.params.id;
    const cart = req.session.cart || [];

    // Check if product is already in cart
    const existingItem = cart.find(item => item._id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Assuming you have a Product/ExtraCategory model
        ExtraCatModel.findById(productId)
            .then(product => {
                if (product) {
                    cart.push({ 
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                    req.session.cart = cart;
                    res.redirect('/cart');
                } else {
                    res.status(404).send("Product not found");
                }
            })
            .catch(err => {
                res.status(500).send("Error adding to cart");
            });
    }
};

module.exports.showCart = (req, res) => {
    const cart = req.session.cart || [];
    res.render('pages/cart', { cart });
};

module.exports.removeCart = (req, res) => {
    const itemId = req.params.id;

    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item._id !== itemId);
    }

    res.redirect('/cart');
}