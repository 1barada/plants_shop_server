import clientError from "../models/clientError.js";

const roleMiddleware = (roles) => {
    return function(req, res, next) {
        try {
            if (!req.user) {
                console.error('no tokenValidation before declaring roleMiddleware');
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

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    errors: [
                        new clientError(
                            403,
                            'user has no access',
                            'user role has no access to this url',
                            '',
                            req.originalUrl
                        )
                    ]
                });
            }
            
            next();
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
};

export default roleMiddleware;