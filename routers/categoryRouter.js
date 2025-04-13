const { Router } = require("express");
const categoryController = require('../controllers/categoryController');
const upload = require("../middlewares/uploadImge");

const categoryRouter = Router();


categoryRouter.post('/cat',upload,categoryController.categoryCreate);
categoryRouter.get('/allcat',categoryController.category);
categoryRouter.delete('/delete/:id',categoryController.deletecat);
categoryRouter.put('/update/:id',upload,categoryController.updatecat);


module.exports = categoryRouter;