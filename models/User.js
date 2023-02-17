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
    purchases: [Number],
    shoppingCart: [Number],
}, {
    timestamps: true
});

const User = model('User', UserSchema);

export default User;