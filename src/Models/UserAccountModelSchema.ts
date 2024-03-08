import { config } from "..";
import mongoose, { Schema, Types } from "mongoose";
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export interface IUserAccounts {
  name: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  username: string;
  passwordHash?: string;
  address?: string;
  pinCode?: string;
  role?: string;
  region?: string;
  lastItemBought?: string;
  itemsInCart?: [Types.ObjectId];
  lastLoggedIn?: Date;
}

export const UserAccountSchema = new Schema<IUserAccounts>({
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: USER_ROLES.USER,
  },
  address: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  region: {
    type: String,
  },
  lastItemBought: {
    type: String,
  },
  itemsInCart: {
    type: [Schema.Types.ObjectId],
  },
  lastLoggedIn: {
    type: Date,
  },
});

UserAccountSchema.index({ email: 1 }, { unique: true });
UserAccountSchema.index({ phone: 1 });
UserAccountSchema.index({ username: 1 }, { unique: true });

export const UserAccountModel = mongoose.model(
  "UserAccount",
  UserAccountSchema,
  "UserAccounts"
);
