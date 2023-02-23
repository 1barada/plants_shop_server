import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { tokenExpireTimes } from '../config/tokenExpireTimes.js';
import validationResultHandler from '../utils/validationResultHandler.js';
import clientError from '../models/clientError.js';

const generateAccessToken = ({_id, role}) => {
    const expiresIn = tokenExpireTimes[role];
    return jwt.sign({_id, role}, process.env.JWT_SECRET_KEY, {expiresIn})
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        
        const user = await User.findOne({name: username});
        if (!user) {
            return res.status(400).json({
                errors: [
                    new clientError(
                        400,
                        'username or password is incorrect',
                        '',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }
        const rightPassword = bcrypt.compareSync(password, user.passwordHash);
        if (!rightPassword) {
            return res.status(400).json({
                errors: [
                    new clientError(
                        400,
                        'username or password is incorrect',
                        '',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }
        user._doc.token = generateAccessToken(user);
        delete user._doc.purchases;

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errors: [
                new clientError(
                    500,
                    'Server error',
                    '',
                    '',
                    req.originalUrl
                )
            ]
        });
    }
};

export const register = async (req, res) => {
    try {
        const {username, password} = req.body;

        const passwordHash = bcrypt.hashSync(password, 8);

        const newUser = new User({
            name: username,
            passwordHash
        });
        await newUser.save();

        return res.status(200).json({
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errors: [
                new clientError(
                    500,
                    'Server error',
                    '',
                    '',
                    req.originalUrl
                )
            ]
        });
    }
};