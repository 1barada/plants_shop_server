import { Schema, model } from 'mongoose';
import roles from '../config/roles.js';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: roles.user
    },
    avatarUrl: String,
    balance: {
        type: Number,
        min: [0, 'balance can\'t be below 0'],
        default: 0
    },
    purchases: {
        type: [Schema.Types.ObjectId],
        ref: 'Product'
    },
    shoppingCart: {
        type: [Schema.Types.ObjectId],
        ref: 'Product'
    },
}, {
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            ret.shoppingCartCount = ret.shoppingCart.length;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.passwordHash;
            delete ret.purchases;
            delete ret.shoppingCart;
        }
    }
});

const User = model('User', UserSchema);

export default User;