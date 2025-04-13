const { Router } = require("express");
const ecommerceController = require("../controllers/ecommerceController") ;
const upload = require("../middlewares/uploadImge");

const ecommerceRouter = Router();

ecommerceRouter.get('/',ecommerceController.homePage);
ecommerceRouter.get("/subcat/:id",ecommerceController.subcatPage);
ecommerceRouter.get('/extra/view/:id', ecommerceController.viewSingleExtra);
ecommerceRouter.get('/add-to-cart/:id', ecommerceController.addToCart);
ecommerceRouter.get('/cart', ecommerceController.showCart);
ecommerceRouter.get('/remove-from-cart/:id',ecommerceController.removeCart);

module.exports = ecommerceRouter;