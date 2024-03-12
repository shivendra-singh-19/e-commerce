import express from "express";
import { NotificationsAPI } from "./NotificationsAPI";

export const NotificationRouter = express.Router();

NotificationRouter.post("/schedule", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.scheduleNotificationTest(
    object,
    options
  );
  res.send(apiResponse);
});
