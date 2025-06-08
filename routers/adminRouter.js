const { Router } = require("express");
const adminController = require("../controllers/adminController");
const changepassword = require("../middlewares/changepassword");
const passport = require("passport");

const adminRouter  = Router();


adminRouter.get('/signup',adminController.signupPage);
adminRouter.post('/signup',adminController.signup);

adminRouter.get('/login',adminController.loginPage);

adminRouter.post('/login',passport.authenticate('local',{failureRedirect : '/admin/login', successRedirect: '/admin/admin'}));

adminRouter.get('/forgotpassword',adminController.forgotpasswordPage);
adminRouter.post('/forgotpassword',adminController.forgotpassword);

adminRouter.get('/verifyotp',adminController.verifyotp);
adminRouter.post('/verifyotp',adminController.verifyotpPage);

adminRouter.get('/setPassword',adminController.setPassword);
adminRouter.post('/setPassword',changepassword,adminController.setPasswordPage);

adminRouter.use(passport.userAuth);
adminRouter.get('/admin',adminController.adminPage);
adminRouter.get('/dashboard',adminController.indexPage);
adminRouter.get('/viewdata',adminController.viewData);
adminRouter.get('/form',adminController.formData);

module.exports = adminRouter;