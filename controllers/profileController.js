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
        const productsQuantities = new Map();
        const products = await Product.find({_id: {$in: user.purchases.map(product => product.id)}});  
        products.forEach((product) => {
            product = product.toObject();
            const id = product.id.toString()
            productsQuantities.set(id, {product: product, quantity: 0});
        });
        
        user.purchases.forEach(purchase => {
            const productQuantity = productsQuantities.get(purchase.id.toString());
            if (productQuantity) {
                productsQuantities.set(purchase.id.toString(), {product: productQuantity.product, quantity: purchase.quantity});
            }
        });
        
        return res.status(200).json(Array.from(productsQuantities, ([name, value]) => value));
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