import { Schema, model, isValidObjectId } from 'mongoose';
import roles from '../config/roles.js';
import Product from '../models/Product.js';

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
    const purchasesIds = [];
    for (let i = 0; i < purchases.length; i++) {
        if (isValidObjectId(purchases[i].id)) {
            purchasesIds.push(purchases[i].id);
        } else {
            return callback(`product: ${purchases[i].id}, not exist`, this);
        }
    }

    const products = await Product.find({_id: {$in: purchasesIds}});
    if (purchases.length !== products.length) {
        for (let i = 0; i < purchases.length; i++) {
            let has = false;
            for(let j = 0; j < products.length; j++) {
                if (purchases[i].id === products[j]._id.toString()) {
                    has = true;
                }
            }
            if (!has) {
                return callback(`product: ${purchases[i].id}, not exist`, this);
            }
        };
    }

    for (let j = 0; j < products.length; j++) {
        let quantity;
        for (let i = 0; i < purchases.length; i++) {
            if (purchases[i].id === products[j]._id.toString()) {
                quantity = purchases[i].quantity;
                break;
            }
        }

        let posInList = -1;
        for (let i = 0; i < this.purchases.length; i++) {
            if (this.purchases[i].id.toString() === products[j]._id.toString()) {
                posInList = i;
                break;
            }
        }

        if (posInList > -1) {
            this.purchases[posInList].quantity += parseInt(quantity);
        } else {
            this.purchases.push({
                id: products[j]._id,
                quantity: quantity
            });
        }

    };

    await this.save();
    return callback(null, this);
}

const User = model('User', UserSchema);

export default User;