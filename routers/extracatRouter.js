const { Router } = require("express");
const extraCategoryController = require('../controllers/extracatController');
const upload = require("../middlewares/uploadImge");

const extraCategoryRouter = Router();


extraCategoryRouter.post('/extracat',upload,extraCategoryController.extracategoryCreate);
extraCategoryRouter.get('/allextracat',extraCategoryController.extracategory);
extraCategoryRouter.delete('/delete/:id',extraCategoryController.deleteextracat);
extraCategoryRouter.put('/update/:id',upload,extraCategoryController.deleteextracat);

module.exports = extraCategoryRouter;