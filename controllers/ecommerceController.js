const { log } = require("console");
const CatModel = require("../models/categoryModel");
const ExtraCatModel = require("../models/extraCatModel");
const SubCatModel = require("../models/subcatModel");
const fs = require('fs');

module.exports.homePage = async (req, res) => {
    try {
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({});
        let extraData = await ExtraCatModel.find({});

        return res.render('pages/homepage', { catData, subData, extraData });
    } catch (error) {
        console.log(error.message);
        return res.render('pages/homepage', { catData: [], subData: [], extraData: [] });
    }
}


module.exports.viewData = async (req, res) => {
    try {
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({}).populate("categoryId", "name");
        let extraData = await ExtraCatModel.find({}).populate("subcatId", "name");
        return res.render('pages/viewdata', { catData, subData, extraData });
    } catch (error) {
        console.log(error.message);
        return res.render('pages/viewdata', { catData: [], subData: [], extraData: [] });
    }
}

module.exports.formData = async (req, res) => {
    try {
        let catData = await CatModel.find({});
        let subData = await SubCatModel.find({}).populate("categoryId", "name");
        let extraData = await ExtraCatModel.find({}).populate("subcatId", "name");
        return res.render('pages/form', { catData, subData, extraData });
    } catch (error) {
        console.log(error.message);
        return res.render('pages/form', { catData: [], subData: [], extraData: [] });
    }
}

module.exports.delete = async (req, res) => {
    try {
        let { id } = req.params;

        
        let deletData = await CatModel.findByIdAndDelete(id);

        
        let subcategories = await SubCatModel.find({ categoryId: id });

        
        let subcatIds = subcategories.map(sub => sub._id);

        
        await ExtraCatModel.deleteMany({ subcatId: { $in: subcatIds } });

        
        await SubCatModel.deleteMany({ categoryId: id });

        
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
        
        const { name, categoryId } = req.body;

        
        if (!categoryId) {
            return res.send("Please select a category before adding a sub-category.");
        }

        
        const newSubCat = new SubCatModel({
            name,
            categoryId,
        });

        await newSubCat.save();

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
        
        const { name, subcatId, description , price } = req.body;

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
        const catData = await CatModel.find({});
        const subData = await SubCatModel.find({});

        const subCategory = await SubCatModel.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).send("Subcategory not found");
        }

        const subCategories = await ExtraCatModel.find({ subcatId: req.params.id }).populate('subcatId');

        res.render('pages/subcat', { catData, subData, subCategories, subCategory });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


   


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

        return res.render('pages/singlepage', { catData, subData, extraData, extra });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
};

module.exports.addToCart = (req, res) => {
    const productId = req.params.id;
    const cart = req.session.cart || [];

    const existingItem = cart.find(item => item._id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
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

    res.redirect('/home');
}

module.exports.increaseQty = (req, res) => {
    let productId = req.params.id;
    let cart = req.session.cart || [];

    cart = cart.map(item => {
        if (item._id == productId) {
            item.quantity += 1;
        }
        return item;
    });

    req.session.cart = cart;
    res.redirect('/cart');
};

module.exports.decreaseQty = (req, res) => {
    let productId = req.params.id;
    let cart = req.session.cart || [];

    cart = cart.map(item => {
        if (item._id == productId && item.quantity > 1) {
            item.quantity -= 1;
        }
        return item;
    });

    req.session.cart = cart;
    res.redirect('/cart');
};
