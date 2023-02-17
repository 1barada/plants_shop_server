import { Router } from "express";
import { login, register } from '../controllers/authController.js';
import { registerValidation } from "../validations/registerValidation.js";

const router = new Router();

router.post('/login', login)
router.post('/register', registerValidation, register);

export default router;