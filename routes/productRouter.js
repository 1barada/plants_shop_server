import { Router } from "express";
import { create, getAll, sendImgUrl, search } from "../controllers/productController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import roles from "../config/roles.js";
import { createProductValidation } from "../validations/createProductValidation.js";
import tokenValidation from "../validations/tokenValidation.js"
import { uploadAvatarMiddleware } from '../middleware/multerMiddleware.js';
import validationResultHandler from "../utils/validationResultHandler.js";

const router = new Router();

router.post(
    '/',
    tokenValidation,
    roleMiddleware([roles.admin]),
    createProductValidation, 
    validationResultHandler,
    create
);

router.get(
    '/',
    search,
    getAll
);

router.post(
    '/upload',
    tokenValidation,
    roleMiddleware([roles.admin]),
    uploadAvatarMiddleware,
    sendImgUrl
);

export default router;