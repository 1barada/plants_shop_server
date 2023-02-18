import clientError from "../models/clientError.js";
import jwt from "jsonwebtoken";

const tokenValidation = (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({
                errors: [
                    new clientError(
                        401,
                        'user is not authorized',
                        'token is null or invalid',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }

        const token = auth.split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({
                    errors: [
                        new clientError(
                            401,
                            'user is not authorized',
                            'token is null or invalid',
                            '',
                            req.originalUrl
                        )
                    ]
                });
            }

            req.user = user;
            next();
        });
    } catch(error) {
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

export default tokenValidation;