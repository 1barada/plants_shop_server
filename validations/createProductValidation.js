import { body } from 'express-validator';
import conditions from '../config/conditions.js';
import Product from '../models/Product.js';

export const createProductValidation = [
    body('title')
        .isLength({min: 2})
        .withMessage('title is too short')
        .custom(async (value) => {
            const candidate = await Product.exists({title: value});
            return candidate ? Promise.reject('title of product is already in use') : Promise.resolve();
        }),
    body('description')
        .isLength({min: 2})
        .withMessage('description is too short'),
    body('price')
        .isFloat({min: 0.0})
        .withMessage('price must be bigger than 0'),
    body('imgUrl')
        .optional()
        .isURL()
        .withMessage('{value} is not url'),
    body('height')
        .optional()
        .isFloat({min: 0.0})
        .withMessage('height must be bigger than 0'),
    body('weight')
        .optional()
        .isFloat({min: 0.0})
        .withMessage('weight must be bigger than 0'),
    body('needs.water')
        .optional()
        .isIn(conditions)
        .withMessage(`needs.water can only be: ${Object.values(conditions).join(', ')}`),
    body('needs.soil')
        .optional()
        .isIn(conditions)
        .withMessage(`needs.soil can only be: ${Object.values(conditions).join(', ')}`),
    body('needs.sun')
        .optional()
        .isIn(conditions)
        .withMessage(`needs.sun can only be: ${Object.values(conditions).join(', ')}`),
];