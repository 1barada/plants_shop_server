import { body } from 'express-validator';
import User from '../models/User.js';

export const registerValidation = [
    body('name')
        .trim()
        .custom((str) => {
            return !str.includes(' ');
        })
        .withMessage('username can not contain spaces')
        .custom(async name => {
            const isInUse = await User.findOne({name});
            if (isInUse) {
                return Promise.reject();
            }
        })
        .withMessage('username is in use'),
    body('password')
        .isLength({min: 6})
        .withMessage('min length of password is 6 letters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage('password must contain at least one letter and one number')
];