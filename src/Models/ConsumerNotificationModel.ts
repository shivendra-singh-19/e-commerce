import { config } from "..";
import mongoose, { Schema, Types } from "mongoose";
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export interface IConsumerNotification {
  source: Schema.Types.ObjectId;
  createdAt: Date;
}

export const ConsumerNotificationSchema = new Schema<IConsumerNotification>({
  source: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

export const ConsumerNotificationModel = mongoose.model(
  "ConsumerNotification",
  ConsumerNotificationSchema,
  "ConsumerNotification"
);
