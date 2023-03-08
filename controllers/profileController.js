import handleServerErrors from "../utils/handleServerErrors.js";
import User from '../models/User.js';
import Product from '../models/Product.js';

export const profileInfo = async (req, res) => {
    try {
        const {_id} = req.user;

        const user = (await User.findById(_id)).toObject();
        delete user.purchases;
        
        return res.status(200).json(user);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};


export const getPurchases = async (req, res) => {
    try {
        const {_id} = req.user;

        const user = await User.findOne({_id});
        const productsQuantities = [];
        for (let i = 0; i < user.purchases.length; i++) {
            const product = (await Product.findOne({_id: user.purchases[i].id})).toObject();
            productsQuantities.push({product, quantity: user.purchases[i].quantity});
        };
        
        return res.status(200).json(productsQuantities);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const addPurchases = async (req, res) => {
    try {
        const {_id} = req.user;
        const {purchases} = req.body;

        let user = await User.findOne({_id});
        user.addPurchases(purchases, (err, docs) => {
            if (err) {
                err.instance = req.originalUrl;
                return res.status(err.status).json({
                    errors: [
                        err
                    ]
                });
            } 
            user = user.toObject();
            delete user.purchases;
            return res.status(200).json(
                user
            );
        });        
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};