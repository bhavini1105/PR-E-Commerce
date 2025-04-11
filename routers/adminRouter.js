const { Router } = require("express");
const adminController = require("../controllers/adminController");

const adminRouter  = Router();

adminRouter.get('/',adminController.adminPage);
adminRouter.get('/login',adminController.loginPage);
adminRouter.get('/signup',adminController.signupPage);

module.exports = adminRouter;