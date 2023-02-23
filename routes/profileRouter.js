import { Router } from "express";
import tokenValidation from "../validations/tokenValidation.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import roles from "../config/roles.js";
import { getPurchases, addPurchases } from "../controllers/profileController.js";

const router = new Router();

router.get(
    '/purchases', 
    tokenValidation,
    roleMiddleware([roles.admin, roles.user]),
    getPurchases
);

router.patch(
    '/purchases', 
    tokenValidation,
    roleMiddleware([roles.admin, roles.user]),
    addPurchases
);

export default router;