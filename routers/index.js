const { Router } = require("express");
const categoryRouter = require("./categoryRouter");
const subCategoryRouter = require("./subcatRouter");
const extraCategoryRouter = require("./extracatRouter");
const ecommerceRouter = require("./ecommerceRouter");
const adminRouter = require("./adminRouter");

const indexRouter = Router();

indexRouter.use('/home',ecommerceRouter);
indexRouter.use('/cat',categoryRouter);
indexRouter.use('/subcat',subCategoryRouter);
indexRouter.use('/extracat',extraCategoryRouter);

indexRouter.use('/',adminRouter);

module.exports = indexRouter;