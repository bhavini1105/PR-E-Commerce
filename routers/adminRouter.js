const { Router } = require("express");
const adminController = require("../controllers/adminController");
const changepassword = require("../middlewares/changepassword");
const passport = require("passport");
const upload = require("../middlewares/uploadImge");

const adminRouter  = Router();

adminRouter.get('/signup',adminController.signupPage);
adminRouter.post('/signup',adminController.signup);

adminRouter.get('/login',adminController.loginPage);

adminRouter.post('/login',passport.authenticate('local',{failureRedirect : '/login', successRedirect: '/'}));

adminRouter.get('/forgotpassword',adminController.forgotpasswordPage);
adminRouter.post('/forgotpassword',adminController.forgotpassword);

adminRouter.get('/verifyotp',adminController.verifyotp);
adminRouter.post('/verifyotp',adminController.verifyotpPage);

adminRouter.get('/setPassword',adminController.setPassword);
adminRouter.post('/setPassword',changepassword,adminController.setPasswordPage);

adminRouter.use(passport.userAuth);
adminRouter.get('/',adminController.adminPage);
adminRouter.get('/viewdata',adminController.viewData);
adminRouter.get('/form',adminController.formData);
adminRouter.get('/delete/:id',adminController.delete);

adminRouter.get('/category',adminController.categoryPage);
adminRouter.post('/category',upload,adminController.category);

adminRouter.get('/subcategory',adminController.subcategoryPage);
adminRouter.post('/subcategory',adminController.subcategory);
adminRouter.get('/subcat/delete/:id',adminController.deletesub);

adminRouter.get('/extraCategory',adminController.extracategoryPage);
adminRouter.post('/extraCategory',upload,adminController.extracategory);
adminRouter.get('/extracat/delete/:id',adminController.deleteextra);

module.exports = adminRouter;