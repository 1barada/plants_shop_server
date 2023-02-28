import Product from '../models/Product.js';
import handleServerErrors from '../utils/handleServerErrors.js';
import { getMaxValues, setMaxValues } from '../config/maxProductValues.js';
import clientError from '../models/clientError.js';

export const create = async (req, res) => {
    try {
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
        const product = await newProduct.save();
        setMaxValues({price, weight, height});

        return res.status(200).json(product);
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page);

        Product.paginate(page, (err, docs) => {
            if (err) {
                err.instance = req.originalUrl;
                return res.status(400).json({
                    errors: [
                        err
                    ]
                });
            }
            return res.status(200).json(docs);
        });
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const search = async (req, res, next) => {
    try {
        const {title, minPrice, maxPrice, minWeight, maxWeight, minHeight, maxHeight, page} = req.query;
        if (!title && !minPrice && !maxPrice && !minHeight && !maxHeight && !minWeight && !maxWeight) {
            return next();
        }
        
        let candidats = [];
        const maxValues = getMaxValues();
        if (title) {
            candidats = await Product.find({title: {$regex: title, $options: 'i'}});
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
            });
        }
        
        Product.paginateConcrete(candidats, page, (err, docs) => {
            if (err) {
                err.instance = req.originalUrl;
                return res.status(err.status).json({
                    errors: [
                        err
                    ]
                });
            }

            docs.items.forEach(product => {
                product.id = product._id;
                delete product._id;
                delete product.__v;
            });

            return res.status(200).json(docs);
        });
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