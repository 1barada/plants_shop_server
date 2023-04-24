import multer from 'multer';
import imageTypes from '../config/imageTypes.js';
import clientError from '../models/clientError.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const url = req.originalUrl;
        switch (url) {
            case '/product':
                cb(null, 'media');
                break;
            default:
                return cb(new Error('no path to save media. path: ' + url));
        }
        cb(null, 'media')
    },
    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split('/')[1];
        cb(null, Date.now() + '.' + fileExtension)
    }
});

const fileFilter = (req, file, cb) => {
    if (!imageTypes.includes(file.mimetype)) {
        return cb(new Error('this format is not supported'), false);
    }

    cb(null, true);
};

const multerMiddleware = multer({storage, fileFilter});

export const uploadImageMiddleware = (req, res, next) => {
    try {
        multerMiddleware.single('img')(req, res, (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    errors: [
                        new clientError(
                            500,
                            'server error. cannot upload the image',
                            '',
                            '',
                            req.originalUrl
                        ),
                        err
                    ]
                });
            }
    
            next();
        });
    } catch(error) {
        console.log(error);
    }
};