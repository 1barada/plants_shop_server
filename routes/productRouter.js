import { Router } from "express";
import { create, getAll, search, getOne } from "../controllers/productController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import roles from "../config/roles.js";
import { createProductValidation } from "../validations/createProductValidation.js";
import tokenValidation from "../validations/tokenValidation.js"
import { uploadImageMiddleware } from '../middleware/multerMiddleware.js';
import validationResultHandler from "../utils/validationResultHandler.js";
import searchValidation from "../validations/searchValidation.js";

const router = new Router();

router.post(
    '/',
    tokenValidation,
    roleMiddleware([roles.admin]),
    uploadImageMiddleware,
    createProductValidation, 
    validationResultHandler,
    create
);

router.get(
    '/:id',
    getOne
);

router.get(
    '/',
    searchValidation,
    search,
    getAll
);

export default router;