import handleServerErrors from "../utils/handleServerErrors.js";
import User from '../models/User.js';
import Product from '../models/Product.js';
import clientError from '../models/clientError.js';

export const getPurchases = async (req, res) => {
    try {
        const {_id} = req.user;

        const user = await User.findOne({_id});
        const products = [];
        for (let i = 0; i < user.purchases.length; i++) {
            const product = (await Product.findOne({_id: user.purchases[i].id})).toObject();
            product.quantity = user.purchases[i].quantity;
            products.push(product);
        };
        
        return res.status(200).json(products);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const addPurchases = async (req, res) => {
    try {
        const {_id} = req.user;
        const {purchases} = req.body;

        const user = await User.findOne({_id});
        user.addPurchases(purchases, (err, docs) => {
            if (err) {
                return res.status(404).json({
                    errors: [
                        new clientError(
                            404,
                            err,
                            '',
                            '',
                            req.originalUrl
                        )
                    ]
                }); 
            }

            return res.status(200).json(
                docs
            );
        });        
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};