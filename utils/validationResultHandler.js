import clientError from "../models/clientError.js";
import { validationResult } from 'express-validator';

export default function(req, res, next) {
    const validationErrors = validationResult(req).errors;
    const clientErrors = validationErrors.map(error => {
        return new clientError(
            400,
            error.msg,
            '',
            '',
            req.originalUrl
        );
    });

    if (clientErrors.length !== 0) {
        return res.status(400).json({
            errors: clientErrors
        });
    }
    
    next();
}