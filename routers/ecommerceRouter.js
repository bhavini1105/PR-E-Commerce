const { Router } = require("express");
const ecommerceController = require("../controllers/ecommerceController") ;
const upload = require("../middlewares/uploadImge");

const ecommerceRouter = Router();

ecommerceRouter.get('/home',ecommerceController.homePage);
ecommerceRouter.get('/viewdata',ecommerceController.viewData);
ecommerceRouter.get('/form',ecommerceController.formData);
ecommerceRouter.get('/delete/:id',ecommerceController.delete);

ecommerceRouter.get('/category',ecommerceController.categoryPage);
ecommerceRouter.post('/category',upload,ecommerceController.category);

ecommerceRouter.get('/subcategory',ecommerceController.subcategoryPage);
ecommerceRouter.post('/subcategory',ecommerceController.subcategory);
ecommerceRouter.get('/subcat/delete/:id',ecommerceController.deletesub);

ecommerceRouter.get('/extraCategory',ecommerceController.extracategoryPage);
ecommerceRouter.post('/extraCategory',upload,ecommerceController.extracategory);
ecommerceRouter.get('/extracat/delete/:id',ecommerceController.deleteextra);

ecommerceRouter.get("/subcat/:id",ecommerceController.subcatPage);
ecommerceRouter.get('/extra/view/:id', ecommerceController.viewSingleExtra);
ecommerceRouter.get('/cart', ecommerceController.showCart);
ecommerceRouter.get('/add-to-cart/:id', ecommerceController.addToCart);
ecommerceRouter.get('/remove-from-cart/:id', ecommerceController.removeCart);

ecommerceRouter.get('/increase-qty/:id', ecommerceController.increaseQty);
ecommerceRouter.get('/decrease-qty/:id', ecommerceController.decreaseQty);


module.exports = ecommerceRouter;