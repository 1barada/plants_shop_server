import { Router } from "express";
import { login, register } from '../controllers/authController.js';
import { registerValidation } from "../validations/registerValidation.js";
import validationResultHandler from "../utils/validationResultHandler.js";

const router = new Router();

router.post(
    '/login', 
    login
);

router.post(
    '/register', 
    registerValidation, 
    validationResultHandler,
    register
);

export default router;