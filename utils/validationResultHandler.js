import clientError from "../models/clientError.js";
import { validationResult } from 'express-validator';

const validationResultHandler = (req) => {
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

    return clientErrors;
}

export default validationResultHandler;