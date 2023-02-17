import { Router } from "express";
import tokenValidation from "../validations/tokenValidation.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import roles from "../config/roles.js";
import { getPurchases, getShoppingCart } from "../controllers/profileController.js";

const router = new Router();

router.get(
    '/shoppingCart', 
    tokenValidation,
    roleMiddleware([roles.admin, roles.user]),
    getShoppingCart
);

router.get(
    '/purchases', 
    tokenValidation,
    roleMiddleware([roles.admin, roles.user]),
    getPurchases
)

export default router;