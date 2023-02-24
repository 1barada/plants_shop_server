import handleServerErrors from "../utils/handleServerErrors.js";
import { isValidObjectId } from 'mongoose';

export default function purchaseValidation(req, res, next) {
    try {
        const {purchases} = req.body;

        purchases.forEach((purchase) => {
            const isObjectId = isValidObjectId(purchase.id);
            const isValidQuantity = parseInt(purchase.quantity) > 0;

            if (!isObjectId) {
                return res.status(404).json({
                    errors: [
                        new clientError(
                            404,
                            'product not found',
                            'product with such id is not found',
                            '',
                            req.originalUrl
                        )
                    ]
                }); 
            } else if (!isValidQuantity) {
                return res.status(404).json({
                    errors: [
                        new clientError(
                            404,
                            'quantity must be above 0',
                            'quantity is below 1',
                            '',
                            req.originalUrl
                        )
                    ]
                }); 
            }
        });

        next();
    } catch(error) {
        return handleServerErrors(error, req, res);
    }
};