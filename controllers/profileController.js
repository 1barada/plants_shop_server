import handleServerErrors from "../utils/handleServerErrors.js";
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getShoppingCart = async (req, res) => {
    try {
        const {_id} = req.user;

        const user = await User.findOne({_id});
        const products = await Product.find({_id: {$in: user.shoppingCart}});
        
        return res.status(200).json(products);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const getPurchases = async (req, res) => {
    try {
        const {_id} = req.user;

        const user = await User.findOne({_id});
        const products = await Product.find({_id: {$in: user.purchases}});
        
        return res.status(200).json(products);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};