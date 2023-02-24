import clientError from "../models/clientError.js";
import jwt from "jsonwebtoken";
import handleServerErrors from "../utils/handleServerErrors.js";

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
        return handleServerErrors(error, req, res);
    }
};

export default tokenValidation;