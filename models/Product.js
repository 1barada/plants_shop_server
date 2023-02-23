import { Schema, model } from "mongoose";
import conditions from "../config/conditions.js";
import pageLimit from '../config/pageLimit.js';

const productSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: [2, 'title must contain 2 or more letters']
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, 'description must contain 2 or more letters']
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'price can\'t be below 0']
    },
    imgUrl: {
        type: String
    },
    weight: {
        type: Number,
        default: 0,
        min: [0, 'weight can\'t be below 0']
    },
    height: {
        type: Number,
        default: 0,
        min: [0, 'height can\'t be below 0']
    },
    needs: {
        water: {
            type: String,
            default: conditions.low,
            enum: {
                values: Object.values(conditions),
                message: '{VALUE} is not suported. Use: low, middle or high'
            }
        },
        soil: {
            type: String,
            default: conditions.low,
            enum: {
                values: Object.values(conditions),
                message: '{VALUE} is not suported. Use: low, middle or high'
            }
        },
        sun: {
            type: String,
            default: conditions.low,
            enum: {
                values: Object.values(conditions),
                message: '{VALUE} is not suported. Use: low, middle or high'
            }
        }
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    toObject: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

productSchema.statics.paginate = async (page, callback) => {
    if (page < 1) {
        return callback('no such page');
    }
    let result = {
        items: [],
        totalPages: 0
    };
    let skip = pageLimit * (page - 1);

    result.totalPages = Math.ceil((await Product.count({})) / pageLimit);
    if (page > result.totalPages) {
        return callback('no such page');
    }
    result.items = await Product.find().skip(skip).limit(pageLimit);

    return callback(null, result);
};

const Product = model('Product', productSchema);

export default Product;