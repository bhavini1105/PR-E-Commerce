const { Router } = require("express");
const subCategoryController = require('../controllers/subcatController');
const upload = require("../middlewares/uploadImge");

const subCategoryRouter = Router();


subCategoryRouter.post('/subcat',upload,subCategoryController.subcategoryCreate);
subCategoryRouter.get('/allsubcat',subCategoryController.subcategory);
subCategoryRouter.delete('/delete/:id',subCategoryController.deletesubcat);
subCategoryRouter.put('/update/:id',upload,subCategoryController.updatesubcat);

module.exports = subCategoryRouter;