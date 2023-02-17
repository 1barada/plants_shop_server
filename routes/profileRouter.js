import { Router } from "express";
import tokenValidation from "../validations/tokenValidation.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import roles from "../config/roles.js";
import { getProfile } from "../controllers/profileController.js";

const router = new Router();

router.get(
    '/', 
    tokenValidation,
    roleMiddleware([roles.admin, roles.user]),
    getProfile
)

export default router;