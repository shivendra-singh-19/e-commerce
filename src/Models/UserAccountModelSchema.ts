import mongoose, { Schema } from "mongoose";

export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user'
}

export const UserAccountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: USER_ROLES.USER
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    region: {
        type: String
    },
    createdAt: {
        type: Date
    },
    lastItemBought: {
        type: String
    },
    itemsInCart: {
        type: [Schema.Types.ObjectId]
    },
    lastLoggedIn: {
        type: Date
    },
    lastSearchItems: {
        type: Schema.Types.ObjectId
    }
});

UserAccountSchema.index({email: 1});
UserAccountSchema.index({phone: 1 });

export const UserAccountModel = mongoose.model('UserAccount', UserAccountSchema, 'UserAccounts');