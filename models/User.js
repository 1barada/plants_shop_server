import { Schema, model } from 'mongoose';
import roles from '../config/roles.js';
import Product from '../models/Product.js';
import clientError from './clientError.js';
import truncateToTwoDecimals from '../utils/truncateToTwoDecimal.js';

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
    purchases: [{
        _id: false,
        id: {
            type: [Schema.Types.ObjectId],
            ref: 'Product'
        },
        quantity: {
            type: Number,
            min: [1, 'quantity of purchased product cant\'t be below 1']
        }
    }]
}, {
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.passwordHash;
        }
    }
});

UserSchema.methods.addPurchases = async function(purchases, callback) {
    let totalCost = 0;
    const toIncrement = [];
    const toPush = [];
    for (let i = 0; i < purchases.length; i++) {
        const product = await Product.findById(purchases[i].id);
        totalCost = truncateToTwoDecimals((purchases[i].quantity * product._doc.price) + totalCost);

        const index = this.purchases.map(userPurchases => userPurchases.id.toString()).indexOf(purchases[i].id);
        if (index === -1) {
            toPush.push({
                id: purchases[i].id,
                quantity: purchases[i].quantity
            });
        } else {
            toIncrement.push({
                index,
                quantity: purchases[i].quantity
            });
        }
    }

    if (this.balance < totalCost) {
        return callback(new clientError(
            400,
            'not enough money',
            'user balance less than purchase cost',
            '',
            ''
        ), null);
    }

    this.balance = truncateToTwoDecimals(this.balance - totalCost);
    toIncrement.forEach(({index, quantity}) => {
        this.purchases[index].quantity += parseInt(quantity);
    });
    toPush.forEach(push => {
        this.purchases.push(push);
    });
    console.log(this.balance, totalCost, this.purchases)

    await this.save();
    return callback(null, this);;
}

const User = model('User', UserSchema);

export default User;