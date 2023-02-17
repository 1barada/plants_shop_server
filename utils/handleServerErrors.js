import clientError from '../models/clientError.js';

export default function(error, req, res) {
    console.log(error);
    return res.status(500).json({
        errors: [
            new clientError(
                500,
                'server error',
                '',
                '',
                req.originalUrl
            )
        ]
    });
}