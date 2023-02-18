import { Schema, model } from "mongoose";
import conditions from "../config/conditions.js";

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
    }
});

productSchema.index({name: 'text', 'title': 'text'});

const Product = model('Product', productSchema);

export default Product;