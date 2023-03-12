import Product from '../models/Product.js';
import handleServerErrors from '../utils/handleServerErrors.js';
import { getMaxValues, setMaxValues } from '../config/maxProductValues.js';
import clientError from '../models/clientError.js';
import { isObjectIdOrHexString } from 'mongoose';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink)

export const createProduct = async (req, res) => {
    try {
        let imagePath;
        console.log(req.file)
        if (req.file) imagePath = '/' + req.file.path.replaceAll('\\', '/');
        const {title, description, price, height, weight, needs} = req.body;
        const newProduct = new Product({
            title,
            description,
            price,
            imgUrl: imagePath,
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

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                errors: new clientError(
                    400,
                    'no such product',
                    'invalid parameter id or product with such id not exist',
                    '',
                    req.originalUrl
                )
            });
        }

        Product.deleteOne({_id: id}, async (err, docs) => {
            if (err || docs.deletedCount === 0) {
                return res.status(400).json({
                    errors: new clientError(
                        400,
                        'no such product',
                        'invalid parameter id or product with such id not exist',
                        '',
                        req.originalUrl
                    )
                });
            }
            await unlinkAsync(req.file.path);

            return res.status(200).send();
        });
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        if (!id) {
            return res.status(400).json({
                errors: new clientError(
                    400,
                    'no such product',
                    'invalid parameter id or product with such id not exist',
                    '',
                    req.originalUrl
                )
            });
        }

        const update = {
            title: body.title,
            description: body.description,
            price: body.price,
            weight: body.weight,
            height: body.height,
        }

        Product.findOneAndUpdate({_id: id}, (err, docs) => {
            if (err || docs.deletedCount === 0) {
                return res.status(400).json({
                    errors: new clientError(
                        400,
                        'no such product',
                        'invalid parameter id or product with such id not exist',
                        '',
                        req.originalUrl
                    )
                });
            }
            return res.status(200).send();
        });
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
            return res.status(200).json({...docs, maxValues: getMaxValues()});
        });
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};

export const getOne = async (req, res) => {
    try {
        const {id} = req.params;
        if (!isObjectIdOrHexString(id)) {
            return res.status(400).json({
                errors: new clientError(
                    400,
                    'no such product',
                    'invalid parameter id',
                    '',
                    req.originalUrl
                )
            });
        }
        Product.findById(id, (err, docs) => {
            if (err || !docs) {
                return res.status(400).json({
                    errors: new clientError(
                        400,
                        'no such product',
                        'cannot get product. check if your id parameter is valid',
                        '',
                        req.originalUrl
                    )
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

            return res.status(200).json({...docs, maxValues: getMaxValues()});
        });
    } catch (error) {
        return handleServerErrors(error, req, res);
    }
};