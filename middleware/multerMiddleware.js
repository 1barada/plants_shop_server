import multer from 'multer';
import imageTypes from '../config/imageTypes.js';
import clientError from '../models/clientError.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const url = req.originalUrl;
        switch (url) {
            case '/product':
                cb(null, 'media/images/products');
                break;
            default:
                return cb(new Error('no path to save media. path: ' + url));
        }
        cb(null, 'media/images/products')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension)
    }
});

const fileFilter = (req, file, cb) => {
    if (!imageTypes.includes(file.mimetype)) {
        return cb(new Error('this format is not supported'), false);
    }

    cb(null, true);
};

const multerMiddleware = multer({storage, fileFilter, });

export const uploadImageMiddleware = (req, res, next) => {
    multerMiddleware.single('img')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                errors: [
                    new clientError(
                        400,
                        'this format is not supported. Valid formats: ' + imageTypes.join(', '),
                        '',
                        '',
                        req.originalUrl
                    )
                ]
            });
        }

        next();
    });
};