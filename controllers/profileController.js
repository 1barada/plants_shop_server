import handleServerErrors from "../utils/handleServerErrors.js";
import User from '../models/User.js';
import Product from '../models/Product.js';
import clientError from '../models/clientError.js';
import { Types } from "mongoose";

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

export const addToShoppingCart = async (req, res) => {
    try {
        const {_id} = req.user;
        const productId = req.params.id;

        const user = await User.findOne({_id});
        if (user.shoppingCart.some(id => id.toString() === productId)) {
            return res.status(400).json({
                errors: [
                    new clientError(
                        400,
                        'error, reload site and try again or contact the support service if nothing changed',
                        'product with specified objectId already in list',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }
        const product = await Product.findOne({_id: productId});
        if (!product) {
            console.log(product);
            return res.status(400).json({
                errors: [
                    new clientError(
                        400,
                        'error, reload site and try again or contact the support service if nothing changed',
                        'product with specified objectId doesn\'t exist',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }
        user.shoppingCart.push(new Types.ObjectId(productId));
        await user.save();

        return res.status(200).end();
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const removeFromShoppingCart = async (req, res) => {
    try {
        const {_id} = req.user;
        const productId = req.params.id;

        const user = await User.findOne({_id});
        const length = user.shoppingCart.length;
        user.shoppingCart = user.shoppingCart.filter(product => product._id.toString() !== productId);
        if (length === user.shoppingCart.length) {
            return res.status(400).json({
                errors: [
                    new clientError(
                        400,
                        'error, please contact the support service',
                        'product with specified objectId has not found',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }
        await user.save();

        return res.status(200).end();
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};