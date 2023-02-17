import Product from '../models/Product.js';
import handleServerErrors from '../utils/handleServerErrors.js';
import validationResultHandler from '../utils/validationResultHandler.js';
import { getMaxValues, setMaxValues } from '../config/maxProductValues.js';

export const create = async (req, res) => {
    try {
        const validationErrors = validationResultHandler(req);
        if (validationErrors.length !== 0) {
            return res.status(400).json({
                errors: validationErrors
            });
        }

        const {title, description, price, imgUrl, height, weight, needs} = req.body;
        const newProduct = new Product({
            title,
            description,
            price,
            imgUrl,
            height,
            weight,
            needs
        });
        const product = (await newProduct.save()).toObject();
        setMaxValues({price, weight, height});

        product.id = product._id;
        delete product._id;
        delete product.__v;

        return res.status(200).json(product);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const getAll = async (req, res) => {
    try {
        const validationErrors = validationResultHandler(req);
        if (validationErrors.length !== 0) {
            return res.status(400).json({
                errors: validationErrors
            });
        }
        
        const products = await Product.find().lean();

        products.forEach(product => {
            product.id = product._id;
            delete product._id;
            delete product.__v;
        });
        
        return res.status(200).json(products);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const search = async (req, res) => {
    try {
        const {title, minPrice, maxPrice, minWeight, maxWeight, minHeight, maxHeight} = req.query;

        let candidats = [];
        const maxValues = getMaxValues();
        if (title) {
            candidats = await Product.find({title: {$regex: title, $options: 'i'}}).lean();
            candidats = candidats.filter(({price, weight, height}) => 
                (price >= (minPrice || 0)) && (price <= (maxPrice || maxValues.maxPrice)) &&
                (weight >= (minWeight || 0)) && (weight <= (maxWeight || maxValues.maxWeight)) && 
                (height >= (minHeight || 0)) && (height <= (maxHeight || maxValues.maxHeight))
            );
        } else {
            candidats = await Product.find({
                price: {$gte: minPrice || 0, $lte: maxPrice || maxValues.maxPrice},
                weight: {$gte: minWeight || 0, $lte: maxWeight || maxValues.maxWeight},
                height: {$gte: minHeight || 0, $lte: maxHeight || maxValues.maxHeight}
            }).lean();
        }

        candidats.forEach(product => {
            product.id = product._id;
            delete product._id;
            delete product.__v;
        });

        return res.status(200).json(candidats);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const sendImgUrl = (req, res) => {
    try {
        const imagePath = req.file.path.replaceAll('\\', '/');
        return res.json({path: imagePath});
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};