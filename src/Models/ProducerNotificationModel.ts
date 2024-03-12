import { config } from "..";
import mongoose, { Schema, Types } from "mongoose";
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export interface IProducerNotification {
  scheduledAt: Date;
  result: number;
  resultMultiple: number;
  message: string;
}

export const ProducerNotificationSchema = new Schema<IProducerNotification>({
  scheduledAt: {
    type: Date,
  },
  result: {
    type: Number,
    required: true,
  },
  resultMultiple: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const ProducerNotificationModel = mongoose.model(
  "ProducerNotification",
  ProducerNotificationSchema,
  "ProducerNotifications"
);
